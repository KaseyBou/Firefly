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
      className={`bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-[#B7BA64] transition-colors cursor-pointer ${className}`}
      onClick={onClick}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className='w-full h-40 object-cover rounded-md mb-3'
        />
      )}
      <h2 className='text-lg font-semibold'>{title}</h2>
      {subtitle && <p className='text-sm italic'>{subtitle}</p>}
      {children}
    </li>
  );
}
