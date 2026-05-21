import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Custom map pin icons ──────────────────────────────────────────────────────

// Teal teardrop with a house icon — used for the user's home/active location
function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="32" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20S24 21 24 12C24 5.4 18.6 0 12 0z"
            fill="#007b8a" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="7" fill="white"/>
      <path d="M12 6.8L6.5 12h1.5v5.5h3.5v-3.5h1v3.5H16V12h1.5z" fill="#007b8a"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
}

// Red teardrop with a hospital cross — used for facility locations
function createFacilityIcon() {
  return L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="26" height="34">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20S24 21 24 12C24 5.4 18.6 0 12 0z"
            fill="#e05555" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="7" fill="white"/>
      <rect x="10.5" y="7.5" width="3" height="9" rx="1" fill="#e05555"/>
      <rect x="7.5" y="10.5" width="9" height="3" rx="1" fill="#e05555"/>
    </svg>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -36],
  });
}

// Blue pulsing dot — used for the device's live GPS location
function createGpsIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:16px;height:16px;
      background:#3b82f6;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 6px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

export default function MapComponent({
  center = [7.1907, 125.4553],
  zoom = 12,
  markers = [],
  clickable = false,
  onMapClick = null,
  routeTo = null,
  autoCenter = true,
  origin = null,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clickHandlerRef = useRef(null);
  const userLocRef = useRef(null);
  const routeLayerRef = useRef(null);
  const autoCenterRef = useRef(autoCenter);
  const originRef = useRef(origin);

  useEffect(() => {
    autoCenterRef.current = autoCenter;
  }, [autoCenter]);

  useEffect(() => {
    originRef.current = origin;
  }, [origin]);

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
      // Only recenter on GPS and show "You are here" when no explicit location is set.
      // openPopup() triggers Leaflet autoPan which would override the home pin center.
      if (autoCenterRef.current) {
        mapInstanceRef.current.setView(e.latlng, 15);
        L.marker(e.latlng, { icon: createGpsIcon() })
          .addTo(mapInstanceRef.current)
          .bindPopup("You are here!")
          .openPopup();
      }
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
      const icon = markerData.markerType === "user" ? createUserIcon() : createFacilityIcon();
      const marker = L.marker(markerData.position, { icon })
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
    // Prefer the explicit origin (home/active location) over GPS
    if (originRef.current) {
      drawRoute({ lat: originRef.current[0], lng: originRef.current[1] });
      return;
    }

    // Fall back to GPS if no explicit origin is set
    if (userLocRef.current) {
      drawRoute(userLocRef.current);
      return;
    }

    // Otherwise wait for geolocation to resolve, then draw
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