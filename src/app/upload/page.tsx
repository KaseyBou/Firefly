'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Polygon,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createObservation } from '../actions/observations';
import { UploadButton } from '@/app/libs/uploadthing';
import { isInsideCT, CT_POLYGON } from '../libs/helperFunctions';
import '@uploadthing/react/styles.css';

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

export default function UploadPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [isMapPicking, setIsMapPicking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGetLocation = () => {
    setIsLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!isInsideCT(latitude, longitude)) {
          setError('Your GPS shows you are outside Connecticut.');
          setLocation(null);
        } else {
          setLocation({ lat: latitude, lng: longitude });
        }
        setIsLocating(false);
      },
      () => {
        setError('Location access denied. Please enable GPS.');
        setIsLocating(false);
      },
    );
  };

  const handleMapPick = (lat: number, lng: number) => {
    if (!isInsideCT(lat, lng)) {
      setError('Sighting must be within Connecticut state lines.');
      return;
    }
    setLocation({ lat, lng });
    setError('');
  };

  async function onSubmit(formData: FormData) {
    if (!location) return setError('Please mark a location.');
    if (!imageUrl) return setError('Please upload a photo.');

    const payload = {
      speciesName: formData.get('speciesName'),
      description: formData.get('description'),
      latitude: location.lat,
      longitude: location.lng,
      imageUrl: imageUrl,
    };

    const result = await createObservation(payload);
    if (result?.error) {
      setError(result.error);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/species');
        router.refresh();
      }, 2000);
    }
  }

  // --- Success State UI ---
  if (isSuccess) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-black text-center p-6'>
        <div className='w-24 h-24 bg-[#C8FF00] rounded-full flex items-center justify-center mb-6 animate-pulse'>
          <span className='text-black text-5xl font-bold'>✓</span>
        </div>
        <h2 className='text-3xl font-bold text-white mb-2'>
          Observation Secured
        </h2>
        <p className='text-zinc-500'>
          Your discovery has been added to the database.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white'>
      <div className='w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl'>
        <h1 className='text-3xl font-bold text-[#C8FF00] mb-6'>
          Share Discovery
        </h1>

        <form action={onSubmit} className='flex flex-col gap-5'>
          {error && (
            <p className='text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20'>
              {error}
            </p>
          )}

          {/* IMAGE UPLOADER */}
          <div className='border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center bg-black/50'>
            {imageUrl ? (
              <div className='relative group'>
                <img
                  src={imageUrl}
                  // Added shadow-2xl and a slight border for depth
                  className='h-44 w-full object-cover rounded-lg mb-2 shadow-2xl border border-zinc-800'
                  alt='Preview'
                />
                <button
                  type='button'
                  onClick={() => setImageUrl('')}
                  className='absolute top-2 right-2 bg-black/80 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition-all border border-zinc-700'
                >
                  Change
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint='imageUploader'
                onClientUploadComplete={(res) => setImageUrl(res[0].url)}
                onUploadError={(error: Error) => setError(error.message)}
                appearance={{
                  button: 'bg-[#C8FF00] text-black font-bold border-none',
                  allowedContent: 'text-zinc-500',
                }}
              />
            )}
          </div>

          <input
            name='speciesName'
            placeholder='Species Name'
            required
            className='w-full p-4 rounded-xl bg-black border border-zinc-800 focus:border-[#C8FF00] outline-none transition-all'
          />
          <textarea
            name='description'
            placeholder='Describe the sighting...'
            rows={3}
            required
            className='w-full p-4 rounded-xl bg-black border border-zinc-800 focus:border-[#C8FF00] outline-none transition-all'
          />

          {/* LOCATION ACTIONS */}
          <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => setIsMapPicking(!isMapPicking)}
                className={`p-4 rounded-xl border transition-all text-xs font-bold ${isMapPicking ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-zinc-800 text-zinc-400'}`}
              >
                {isMapPicking ? 'Close Map' : 'Select on Map 🗺️'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsMapPicking(false);
                  handleGetLocation();
                }}
                className={`p-4 rounded-xl border border-zinc-800 text-zinc-400 text-xs font-bold hover:bg-zinc-900 transition-all ${isLocating && 'animate-pulse'}`}
              >
                {isLocating ? 'Locating...' : 'Mark my location 📍'}
              </button>
            </div>

            {isMapPicking && (
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
                    <Marker
                      position={[location.lat, location.lng]}
                      icon={icon}
                    />
                  )}
                </MapContainer>
                <div className='absolute bottom-3 left-3 z-[1000] bg-black/70 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] text-[#C8FF00] font-medium'>
                  Tap within the dashed lines to pin location
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!imageUrl || !location}
            className='bg-[#C8FF00] text-black font-bold py-4 rounded-xl disabled:opacity-20 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4'
          >
            Post Observation
          </button>
        </form>
      </div>
    </div>
  );
}
