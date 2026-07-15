"use client";

import { useMapEvents, useMap } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import type { Story } from "@/types";

const defaultIcon = L.divIcon({
  className: "postmark-marker",
  html: `<div style="width:32px;height:32px;border:2px double #1A1A1B;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(26,26,27,0.1);transform:rotate(-5deg);">
    <svg xmlns="http://www.w3.org/2000/svg" style="width:16px;height:16px;color:#F5F5DC" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -36],
});

const selectedIcon = L.divIcon({
  className: "selected-marker",
  html: `<div style="width:40px;height:40px;background:#ba002a;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:2px 2px 0px 0px #410008;">
    <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;color:white" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -44],
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
              <p className="font-headline-md text-sm mb-1">{story.authorName || "ANONYMOUS"}</p>
              <p className="text-sm">{story.content.slice(0, 100)}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
