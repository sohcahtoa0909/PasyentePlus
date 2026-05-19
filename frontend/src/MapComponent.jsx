import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapComponent({
  center = [7.1907, 125.4553],
  zoom = 12,
  markers = [],
  selectedId = null,
  onMapReady = null,
  clickable = false,
  onMapClick = null,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clickHandlerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    if (onMapReady && typeof onMapReady === 'function') onMapReady(mapInstanceRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    const handleLocationFound = (e) => {
      mapInstanceRef.current.setView(e.latlng, 15);
      L.marker(e.latlng)
        .addTo(mapInstanceRef.current)
        .bindPopup("You are here!")
        .openPopup();
    };

    const handleLocationError = (e) => {
      console.log("Location error:", e.message);
    };

    mapInstanceRef.current.on('locationfound', handleLocationFound);
    mapInstanceRef.current.on('locationerror', handleLocationError);
    mapInstanceRef.current.locate({
      setView: false,
      maxZoom: 16,
      watch: false,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('locationfound', handleLocationFound);
        mapInstanceRef.current.off('locationerror', handleLocationError);
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Prepare icon URLs (reuse same CDN assets)
    const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
    const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
    const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

    const defaultIcon = L.icon({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Create a gold SVG marker as a data URL so we can match app color scheme
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='36' height='58' viewBox='0 0 36 58'>
        <defs>
          <filter id='s' x='-50%' y='-50%' width='200%' height='200%'>
            <feDropShadow dx='0' dy='6' stdDeviation='6' flood-color='rgba(0,0,0,0.35)' />
          </filter>
        </defs>
        <g filter='url(#s)'>
          <path d='M18 0c6 0 11 4.9 11 11 0 9.6-11 26-11 26S7 20.6 7 11C7 4.9 12 0 18 0z' fill='#f59e0b' stroke='#b76a00' stroke-width='1'/>
          <circle cx='18' cy='11' r='5.5' fill='white' opacity='0.95'/>
        </g>
      </svg>
    `;

    const selectedIcon = L.icon({
      iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      iconSize: [36, 58],
      iconAnchor: [18, 58],
      popupAnchor: [1, -44],
      shadowSize: [58, 58],
    });

    // Add new markers
    markers.forEach((markerData) => {
      const isSelected = selectedId != null && markerData.id === selectedId;
      const marker = L.marker(markerData.position, { icon: isSelected ? selectedIcon : defaultIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(markerData.popupContent || markerData.name);

      if (markerData.name) {
        marker.bindTooltip(markerData.name, { permanent: false, direction: "top" });
      }

      if (markerData.onClick) {
        marker.on('click', () => markerData.onClick(markerData));
      }

      markersRef.current.push(marker);
    });
  }, [markers, selectedId]);

  // Update view when center or zoom change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (clickHandlerRef.current) {
      mapInstanceRef.current.off('click', clickHandlerRef.current);
      clickHandlerRef.current = null;
    }

    if (clickable && onMapClick) {
      const handler = (e) => onMapClick(e.latlng);
      mapInstanceRef.current.on('click', handler);
      clickHandlerRef.current = handler;
      const container = mapInstanceRef.current.getContainer();
      if (container) container.style.cursor = 'crosshair';
    } else {
      const container = mapInstanceRef.current.getContainer();
      if (container) container.style.cursor = '';
    }

    return () => {
      if (clickHandlerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.off('click', clickHandlerRef.current);
        clickHandlerRef.current = null;
      }
    };
  }, [clickable, onMapClick]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}