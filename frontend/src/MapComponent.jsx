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
  routeTo = null,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clickHandlerRef = useRef(null);
  const userLocRef = useRef(null);
  const routeLayerRef = useRef(null);

  // Map initialization - only runs once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    const handleLocationFound = (e) => {
      userLocRef.current = e.latlng;
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
      maximumAge: 0
    });
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

  useEffect(() => {    
    if (!mapInstanceRef.current) return;

    // Clear existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (!routeTo) return;

    const { lat: toLat, lng: toLng } = routeTo;

    function drawRoute(origin) {
      // ✅ Fixed: no trailing comma before ?
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origin.lng},${origin.lat};${toLng},${toLat}` +
        `?overview=full&geometries=geojson`;

      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.code !== "Ok" || !data.routes.length) {
            console.error("Could not find a route to this facility");
            return;
          }

          const coords = data.routes[0].geometry.coordinates
            .map(([lng, lat]) => [lat, lng]);

          routeLayerRef.current = L.polyline(coords, {
            color: "#007b8a",
            weight: 5,
            opacity: 0.85,
            lineJoin: "round",
          }).addTo(mapInstanceRef.current);

          // ✅ Fixed: fitBounds not fitBound
          mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
            padding: [40, 40],
          });
        })
        .catch((err) => console.error("Routing request failed", err));
    }
    // If we already have the user's location, draw immediately
    if (userLocRef.current) {
      drawRoute(userLocRef.current);
      return;
    }

    // ✅ Otherwise wait for geolocation to resolve, then draw
    const onLocationFound = (e) => {
      mapInstanceRef.current.off("locationfound", onLocationFound);
      drawRoute(e.latlng);
    };
    mapInstanceRef.current.on("locationfound", onLocationFound);

    const onLocationError = (e) => {
      console.error("locationerror during routing locate():", e.message, "code:", e.code);
      mapInstanceRef.current.off("locationerror", onLocationError);
      mapInstanceRef.current.off("locationfound", onLocationFound);
    };
    mapInstanceRef.current.on("locationerror", onLocationError);

    // Re-request location in case the first one already fired and we missed it
    mapInstanceRef.current.locate({
      setView: false,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, [routeTo]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}