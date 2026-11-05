import { useState } from 'react';
import { getInitials } from '../../utils/helpers.js';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-28 w-28 text-3xl',
};

const palette = ['bg-brand-100 text-brand-800', 'bg-amber-100 text-amber-800', 'bg-sky-100 text-sky-800', 'bg-rose-100 text-rose-800', 'bg-violet-100 text-violet-800', 'bg-lime-100 text-lime-800'];

/** Profile image with an initials fallback (also used if the image fails to load). */
export default function Avatar({ name, src, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const colour = palette[(name?.charCodeAt(0) ?? 0) % palette.length];

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${sizes[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizes[size]} ${colour} inline-flex shrink-0 items-center justify-center rounded-full font-bold`}
    >
      {getInitials(name)}
    </span>
  );
}
