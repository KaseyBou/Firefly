'use client';

type CardProps = {
  imageSrc: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export default function Card({
  imageSrc,
  title,
  subtitle,
  onClick,
  className = '',
  children,
}: CardProps) {
  return (
    <li
      className={`group bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#C8FF00]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer list-none ${className}`}
      onClick={onClick}
    >
      <div className='relative aspect-[4/3] overflow-hidden'>
        <img
          src={imageSrc}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        {/* Subtle overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
      </div>

      <div className='p-4'>
        <h2 className='text-base md:text-lg font-bold truncate group-hover:text-[#C8FF00] transition-colors'>
          {title}
        </h2>
        {subtitle && (
          <p className='text-xs italic text-zinc-500 truncate mb-2'>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </li>
  );
}
