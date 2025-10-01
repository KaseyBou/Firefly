'use client';
import Modal from './Modal';

type SpeciesModalProps = {
  species: any;
  onClose: () => void;
};

export default function SpeciesModal({ species, onClose }: SpeciesModalProps) {
  const { taxon } = species;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <img
        src={taxon.default_photo?.medium_url || '/placeholder.jpg'}
        alt={taxon.name}
        className='w-full h-60 object-cover rounded mb-4'
      />
      <h2 className='text-2xl font-bold mb-2'>
        {taxon.preferred_common_name || taxon.name}
      </h2>
      <p className='italic mb-2'>{taxon.name}</p>
      {taxon.conservation_status && (
        <p className='mb-2'>
          <strong>Conservation Status:</strong>{' '}
          {taxon.conservation_status.status_name ||
            taxon.conservation_status.iucn}
        </p>
      )}
      {taxon.wikipedia_summary && (
        <div className='mt-2 whitespace-pre-line'>
          <p>{taxon.wikipedia_summary}</p>
        </div>
      )}
    </Modal>
  );
}
