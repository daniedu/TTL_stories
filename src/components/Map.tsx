"use client";

import { useMapEvents, useMap } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import type { Story } from "@/types";

const defaultIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;background:white;border:2px solid #1A1A1B;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:2px 2px 0px #1A1A1B;cursor:pointer;transition:transform 0.2s;">
    <div style="width:10px;height:10px;background:#00416A;border-radius:50%;"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -18],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;background:#C60C30;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:2px 2px 0px #410008;cursor:pointer;">
    <svg xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -22],
});

function FlyToCenter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  const lat = center?.[0];
  const lng = center?.[1];
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], 13, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

function ClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Map({
  stories,
  selectedPosition,
  userPosition,
  onMapClick,
}: {
  stories: Story[];
  selectedPosition: [number, number] | null;
  userPosition: [number, number] | null;
  onMapClick: (latlng: [number, number]) => void;
}) {
  return (
    <MapContainer
      center={userPosition ?? [20, 0]}
      zoom={userPosition ? 13 : 2}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      <FlyToCenter center={userPosition} />
      {selectedPosition && (
        <Marker position={selectedPosition} icon={selectedIcon}>
          <Popup>
            <div className="font-body-md text-ink-black text-sm">
              <p>New dispatch here</p>
            </div>
          </Popup>
        </Marker>
      )}
      {stories.map((story) => (
        <Marker
          key={story.id}
          position={[story.location.latitude, story.location.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="font-body-md text-ink-black max-w-[200px]">
              <p className="font-headline-md text-sm mb-1">
                {story.authorName || "ANONYMOUS"}
              </p>
              <p className="text-sm line-clamp-3">{story.content}</p>
              <p className="font-metadata text-xs text-ink-black/50 mt-1">
                {story.visibility.toUpperCase()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
