import React, { useMemo } from 'react';
import clsx from 'clsx';

/**
 * GradientUnderline
 * Wrap important keywords with a bold style plus a gradient underline that
 * fades from a solid color to transparent.
 */
export interface GradientUnderlineProps {
  children: React.ReactNode;
  from?: string; // starting color
  to?: string;   // ending color (often transparent)
  direction?: 'ltr' | 'rtl';
  height?: string; // underline height (e.g. 0.35em)
  className?: string;
  rounded?: boolean;
  /** Whether to animate a highlight fill on hover / focus. */
  highlightOnHover?: boolean;
  /** Opacity (0-1) of the highlight fill relative to the base color. */
  highlightOpacity?: number;
  /** Height of the highlight fill (percentage of text line height). */
  highlightHeight?: string; // e.g. '65%'
  /** Animation duration for fill (CSS time). */
  fillDuration?: string;
}

export const GradientUnderline: React.FC<GradientUnderlineProps> = ({
  children,
  from = '#0ea5e9',
  to = 'transparent',
  direction = 'ltr',
  height = '0.35em',
  className,
  rounded = true,
  highlightOnHover = true,
  highlightOpacity = 0.18,
  highlightHeight = '100%',
  fillDuration = '600ms',
}) => {
  const gradientDir = direction === 'ltr' ? 'to right' : 'to left';
  const underlineStyle: React.CSSProperties = {
    background: `linear-gradient(${gradientDir}, ${from}, ${to})`,
    height,
    borderRadius: rounded ? '4px' : undefined,
  };

  // Derive highlight color with reduced opacity. Supports hex (#rgb, #rrggbb) or returns the base color with opacity via rgba.
  const highlightColor = useMemo(() => {
    const normalizeHex = (hex: string) => {
      if (!hex.startsWith('#')) return null;
      const raw = hex.slice(1);
      if (raw.length === 3) {
        return raw.split('').map(ch => ch + ch).join('');
      }
      if (raw.length === 6) return raw;
      return null;
    };
    const norm = normalizeHex(from);
    if (norm) {
      const r = parseInt(norm.slice(0, 2), 16);
      const g = parseInt(norm.slice(2, 4), 16);
      const b = parseInt(norm.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${highlightOpacity})`;
    }
    // fallback: use color-mix if supported, else just from.
    return `color-mix(in srgb, ${from} ${highlightOpacity * 100}%, transparent)`;
  }, [from, highlightOpacity]);

  return (
    <span
      className={clsx(
        'relative inline-block font-bold leading-tight text-blue-900',
        highlightOnHover && 'group',
        className
      )}
      tabIndex={highlightOnHover ? 0 : undefined}
    >
      {/* Highlight fill */}
      {highlightOnHover && (
        <span
          aria-hidden
          className={clsx(
            'absolute left-0 bottom-0 w-0',
            'pointer-events-none select-none -z-[1]',
            'transition-[width] ease-out',
            // A custom duration via inline style to allow per-instance tuning
            'group-hover:w-full group-focus-visible:w-full'
          )}
          style={{
            background: highlightColor,
            height: highlightHeight,
            borderRadius: rounded ? '4px' : undefined,
            transitionDuration: fillDuration,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute left-0 bottom-[0.05em] w-full pointer-events-none select-none -z-0"
        style={underlineStyle}
      />
    </span>
  );
};

export default GradientUnderline;
