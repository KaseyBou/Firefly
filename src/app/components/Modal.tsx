'use client';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <div
        className='bg-gray-900 text-white p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white font-semibold'
          onClick={onClose}
        >
          Back
        </button>
        {children}
      </div>
    </div>
  );
}
