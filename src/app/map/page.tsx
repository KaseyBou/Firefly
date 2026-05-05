'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import { getObservations } from '../actions/observations';

// 1. Dynamically import Map components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

function MapContent() {
  const searchParams = useSearchParams();
  const speciesQuery = searchParams.get('species');
  const [obs, setObs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      setCustomIcon(
        new L.Icon({
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      );
    });
  }, []);

  useEffect(() => {
    getObservations(speciesQuery, filter).then((data) => {
      setObs(data);
    });
  }, [speciesQuery, filter]);

  if (!customIcon)
    return (
      <div className='h-[calc(100vh-73px)] bg-black flex items-center justify-center text-[#C8FF00]'>
        Initializing Map Environment...
      </div>
    );

  return (
    <div className='relative h-[calc(100vh-73px)] w-full bg-black overflow-hidden'>
      {/* FULL SCREEN MODAL */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer'
          onClick={() => setSelectedImage(null)}
        >
          <button className='absolute top-10 right-10 text-white text-4xl hover:text-[#C8FF00] transition-colors'>
            ✕
          </button>
          <img
            src={selectedImage}
            className='max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain'
            alt='Full screen wildlife view'
          />
        </div>
      )}

      {/* FILTERS & INDICATORS */}
      {/* z-index lowered slightly to ensure it stays below the Header's z-50/60 */}
      <div className='absolute top-6 right-6 z-[40] flex flex-col items-end gap-3'>
        <div className='flex bg-zinc-900/90 backdrop-blur border border-zinc-800 p-1 rounded-xl shadow-2xl'>
          {['24h', 'week', 'month', 'all'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === t
                  ? 'bg-[#C8FF00] text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {speciesQuery && (
          <div className='bg-[#C8FF00] text-black text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl'>
            VIEWING: {speciesQuery.toUpperCase()}
            <button
              onClick={() => (window.location.href = '/map')}
              className='bg-black/10 hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center'
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className='relative h-full w-full z-10'>
        <MapContainer
          center={[41.6, -72.7]}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' />
          {obs.map((o) => (
            <Marker
              key={o.id}
              position={[o.latitude, o.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className='p-1 text-black min-w-[160px] flex flex-col gap-2'>
                  {o.imageUrl && (
                    <img
                      src={o.imageUrl}
                      className='w-full h-28 object-cover rounded-md cursor-pointer'
                      onClick={() => setSelectedImage(o.imageUrl)}
                      alt={o.speciesName}
                    />
                  )}
                  <p className='font-bold text-sm uppercase leading-tight'>
                    {o.speciesName}
                  </p>
                  <p className='text-xs italic text-zinc-600 leading-snug'>
                    "{o.description}"
                  </p>
                  <div className='border-t pt-2 mt-1 flex justify-between text-[10px] text-zinc-400'>
                    <span>@{o.user.username}</span>
                    <span>{new Date(o.spottedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className='h-screen bg-black flex items-center justify-center text-[#C8FF00]'>
          Loading Map...
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
