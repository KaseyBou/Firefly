'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { fetchWikipediaSummary } from '../libs/helperFunctions';
import type { TSpecies } from '../libs/types';

interface SpeciesModalProps {
  species: TSpecies;
  onClose: () => void;
}

export default function SpeciesModal({ species, onClose }: SpeciesModalProps) {
  const { data: session, status, update } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Manual state for DB observations via API
  const [manualCount, setManualCount] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const taxon = species.taxon;
  const speciesDisplayName = taxon.preferred_common_name || taxon.name || '';

  useEffect(() => {
    setIsMounted(true);
    if (status === 'unauthenticated') {
      update();
    }
  }, [status, update]);

  // This Effect handles the "Logout" transition
  useEffect(() => {
    if (status === 'unauthenticated') {
      // 1. Wipe the data immediately so it doesn't leak in the UI
      setManualCount(null);
      // 2. Ensure syncing is stopped
      setIsSyncing(false);
      console.log(
        '🔒 Security: Session cleared, wiping local observation data.',
      );
    }
  }, [status]);

  // 1. Wikipedia Summary Query
  const { data: wikipediaSummary, isLoading: isWikiLoading } = useQuery({
    queryKey: ['wikipedia-summary', taxon.id],
    queryFn: () =>
      fetchWikipediaSummary(taxon.wikipedia_url || taxon.name || ''),
    staleTime: Infinity,
    enabled: isMounted && !!taxon.id,
  });

  // 2. Synchronize with Connecticut database
  useEffect(() => {
    let isSubscribed = true;

    const syncDatabase = async () => {
      if (status !== 'authenticated' || !isMounted || !speciesDisplayName)
        return;

      setIsSyncing(true);
      try {
        const res = await fetch(
          `/api/observations?speciesName=${encodeURIComponent(speciesDisplayName)}&t=${Date.now()}`,
        );
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();

        if (isSubscribed) {
          setManualCount(data.length);
        }
      } catch (error) {
        console.error('❌ Sync Error:', error);
        if (isSubscribed) setManualCount(0);
      } finally {
        if (isSubscribed) setIsSyncing(false);
      }
    };

    syncDatabase();
    return () => {
      isSubscribed = false;
    };
  }, [isMounted, status, speciesDisplayName]);

  if (!isMounted) return null;

  const isAuthenticated = status === 'authenticated';
  const isSessionLoading = status === 'loading';
  const isLoadingData = isSyncing || (manualCount === null && isAuthenticated);

  return (
    <div
      className='fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors z-10'
        >
          ✕
        </button>

        <img
          src={taxon.default_photo?.medium_url || '/placeholder.jpg'}
          alt={speciesDisplayName}
          className='w-full h-56 object-cover rounded-xl mb-4 border border-zinc-800'
        />

        <h2 className='text-2xl font-bold text-white'>{speciesDisplayName}</h2>
        <p className='text-sm italic text-zinc-500 mb-4'>{taxon.name}</p>

        <div className='bg-zinc-900/50 p-4 rounded-lg mb-4 border border-zinc-800/50 text-sm text-zinc-300'>
          <span className='text-xs font-semibold text-zinc-500 uppercase block mb-1'>
            Conservation Status
          </span>
          {taxon.conservation_status?.status_name ?? 'Unknown'}
        </div>

        <div className='text-sm text-zinc-400 leading-relaxed mb-6'>
          {isWikiLoading ? (
            <p className='animate-pulse text-[#C8FF00]'>Loading summary...</p>
          ) : (
            <p>{wikipediaSummary || 'No summary available.'}</p>
          )}
        </div>

        {/* --- COMMUNITY TRACKER SECTION --- */}
        <div className='mt-6 pt-6 border-t border-zinc-800'>
          <h4 className='text-[#C8FF00] font-bold text-base mb-3'>
            Community Tracker
          </h4>

          {isAuthenticated ? (
            // LOGGED IN STATE
            <div className='flex items-center justify-between bg-[#C8FF00]/5 p-5 rounded-xl border border-[#C8FF00]/20'>
              <div className='flex-1'>
                <div className='text-zinc-300 text-sm font-medium'>
                  {isSessionLoading || isLoadingData ? (
                    <span className='animate-pulse text-[#C8FF00] italic'>
                      📡 Synchronizing with CT Database...
                    </span>
                  ) : manualCount === 0 ? (
                    <span>No sightings recorded in CT yet.</span>
                  ) : (
                    <span>
                      {manualCount} observation{manualCount === 1 ? '' : 's'}{' '}
                      found.
                    </span>
                  )}
                </div>
              </div>

              {!isLoadingData && manualCount !== null && manualCount > 0 && (
                <Link
                  href={`/map?species=${encodeURIComponent(speciesDisplayName)}`}
                  className='bg-[#C8FF00] text-black px-4 py-2 rounded-lg font-bold text-xs hover:scale-105 transition-all'
                >
                  View on Map 📍
                </Link>
              )}
            </div>
          ) : (
            // GUEST / TEASER STATE
            <div className='relative group'>
              <div className='flex items-center justify-between bg-zinc-900/30 p-5 rounded-xl border border-zinc-800 blur-[2px] select-none pointer-events-none'>
                <div>
                  <div className='text-zinc-500 text-sm'>
                    12 observations found in Connecticut...
                  </div>
                </div>
                <div className='bg-zinc-800 text-zinc-600 px-4 py-2 rounded-lg font-bold text-xs'>
                  View on Map
                </div>
              </div>

              {/* Overlay CTA */}
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-xl transition-all group-hover:bg-black/10'>
                <p className='text-white text-xs font-semibold mb-2 shadow-sm'>
                  Login to see local sightings
                </p>
                <Link
                  href='/login'
                  className='bg-[#C8FF00] text-black px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider hover:scale-105 transition-transform'
                >
                  Join Community
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
