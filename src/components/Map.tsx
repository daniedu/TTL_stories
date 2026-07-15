"use client";

import { useMapEvents, useMap } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import type { Story } from "@/types";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "selected-marker",
});

L.Marker.prototype.options.icon = defaultIcon;

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
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      <FlyToCenter center={userPosition} />
      {selectedPosition && (
        <Marker position={selectedPosition} icon={selectedIcon}>
          <Popup>New story here</Popup>
        </Marker>
      )}
      {stories.map((story) => (
        <Marker
          key={story.id}
          position={[story.location.latitude, story.location.longitude]}
        >
          <Popup>
            <div className="text-sm text-gray-900">
              <p>{story.content}</p>
              <p className="mt-1 text-xs text-gray-500">
                {story.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
