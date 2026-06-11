'use client';

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Polygon,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CT_POLYGON } from '../libs/helperFunctions';

// Fix for default Leaflet marker icons
const icon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * Capture click/tap events on the map
 */
function LocationPicker({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface UploadMapProps {
  location: { lat: number; lng: number } | null;
  handleMapPick: (lat: number, lng: number) => void;
}

export default function UploadMap({ location, handleMapPick }: UploadMapProps) {
  return (
    <div className='h-72 w-full rounded-xl overflow-hidden border border-zinc-800 relative shadow-inner'>
      <MapContainer
        center={[41.6, -72.7]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' />
        <Polygon
          positions={CT_POLYGON}
          pathOptions={{
            color: '#C8FF00',
            fillOpacity: 0.05,
            weight: 2,
            dashArray: '5, 10',
          }}
        />
        <LocationPicker onPick={handleMapPick} />
        {location && (
          <Marker position={[location.lat, location.lng]} icon={icon} />
        )}
      </MapContainer>
      <div className='absolute bottom-3 left-3 z-[1000] bg-black/70 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] text-[#C8FF00] font-medium'>
        Tap within the dashed lines to pin location
      </div>
    </div>
  );
}
