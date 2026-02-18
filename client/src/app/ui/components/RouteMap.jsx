import React, { useMemo } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";

function decodePolyline(encoded) {
  let index = 0, lat = 0, lng = 0;
  const points = [];

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

// Dark map style (clean + premium, no overkill)
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0b0f14" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b0f14" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#141b24" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0b0f14" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a141b" }] },
];

export default function RouteMap({ polyline, height = 280 }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const path = useMemo(() => {
    if (!polyline) return [];
    try {
      return decodePolyline(polyline);
    } catch {
      return [];
    }
  }, [polyline]);

  const center = path.length ? path[Math.floor(path.length / 2)] : { lat: 32.0853, lng: 34.7818 };

  if (!apiKey) {
    return (
      <div className="mv-mapBox mv-muted" style={{ height }}>
        Missing <b>VITE_GOOGLE_MAPS_API_KEY</b>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="mv-mapBox mv-muted" style={{ height }}>
        Loading map…
      </div>
    );
  }

  return (
    <div className="mv-mapBox" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={12}
        options={{
          styles: DARK_MAP_STYLE,
          disableDefaultUI: true,
          clickableIcons: false,
          keyboardShortcuts: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
        }}
        onLoad={(map) => {
          if (!path.length) return;
          const bounds = new window.google.maps.LatLngBounds();
          path.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds);
        }}
      >
        {path.length ? (
          <Polyline
            path={path}
            options={{
              strokeColor: "#19d3c5", // teal accent
              strokeOpacity: 0.95,
              strokeWeight: 5,
            }}
          />
        ) : null}
      </GoogleMap>
    </div>
  );
}
