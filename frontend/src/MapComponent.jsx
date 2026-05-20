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
  clickable = false,
  onMapClick = null,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clickHandlerRef = useRef(null);

  // Map initialization - only runs once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Re-center whenever the container is resized (panel open animation, tab switch, etc.)
    const ro = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    ro.observe(mapRef.current);

    return () => {
      ro.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - initialization only

  // Update markers when markers prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    markers.forEach((markerData) => {
      const marker = L.marker(markerData.position)
        .addTo(mapInstanceRef.current)
        .bindPopup(markerData.popupContent || markerData.name);

      if (markerData.name) {
        marker.bindTooltip(markerData.name, { permanent: false, direction: "top" });
      }

      markersRef.current.push(marker);
    });
  }, [markers]);

  // Update view when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Wire up / tear down click handler
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (clickHandlerRef.current) {
      mapInstanceRef.current.off("click", clickHandlerRef.current);
      clickHandlerRef.current = null;
    }

    if (clickable && onMapClick) {
      const handler = (e) => onMapClick(e.latlng);
      mapInstanceRef.current.on("click", handler);
      clickHandlerRef.current = handler;
      mapInstanceRef.current.getContainer().style.cursor = "crosshair";
    } else {
      if (mapInstanceRef.current.getContainer()) {
        mapInstanceRef.current.getContainer().style.cursor = "";
      }
    }

    return () => {
      if (clickHandlerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.off("click", clickHandlerRef.current);
      }
    };
  }, [clickable, onMapClick]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}