'use client';

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  (
    {
      variant = 'compact',
      size = 'md',
      className,
    },
    ref
  ) => {
    const sizes = {
      sm: { width: 120, height: 120, symbolSize: 40, wordmarkSize: 14 },
      md: { width: 200, height: 200, symbolSize: 70, wordmarkSize: 18 },
      lg: { width: 300, height: 300, symbolSize: 100, wordmarkSize: 24 },
    };

    const { width, height, symbolSize, wordmarkSize } = sizes[size];

    // Full version with tagline
    if (variant === 'full') {
      return (
        <svg
          ref={ref}
          viewBox="0 0 400 500"
          width={width}
          height={height}
          className={className}
        >
          {/* Symbol: G in circle */}
          <circle
            cx="200"
            cy="120"
            r="60"
            fill="none"
            stroke="#C4532A"
            strokeWidth="2"
          />
          <text
            x="200"
            y="140"
            fontSize="80"
            fontFamily="'Cormorant Garamond', serif"
            fontWeight="300"
            fill="#1A2E20"
            textAnchor="middle"
          >
            G
          </text>

          {/* Wordmark */}
          <text
            x="200"
            y="250"
            fontSize="32"
            fontFamily="'Cormorant Garamond', serif"
            fontWeight="400"
            fill="#1A2E20"
            textAnchor="middle"
            letterSpacing="6"
          >
            G·ARTISANS
          </text>

          {/* Tagline */}
          <text
            x="200"
            y="300"
            fontSize="10"
            fontFamily="'Jost', sans-serif"
            fontWeight="400"
            fill="#7A7A6E"
            textAnchor="middle"
            letterSpacing="3"
            textTransform="uppercase"
          >
            MADE IN EUROPE · SUSTAINABLE · HANDCRAFTED
          </text>
        </svg>
      );
    }

    // Dark version
    if (variant === 'dark') {
      return (
        <svg
          ref={ref}
          viewBox="0 0 400 200"
          width={width}
          height={height}
          className={className}
        >
          {/* Dark background */}
          <rect width="400" height="200" fill="#1A2E20" />

          {/* Symbol: G in circle */}
          <circle
            cx="80"
            cy="100"
            r="45"
            fill="none"
            stroke="#C4532A"
            strokeWidth="2"
          />
          <text
            x="80"
            y="120"
            fontSize="60"
            fontFamily="'Cormorant Garamond', serif"
            fontWeight="300"
            fill="#F5F0E8"
            textAnchor="middle"
          >
            G
          </text>

          {/* Wordmark */}
          <text
            x="200"
            y="125"
            fontSize="28"
            fontFamily="'Cormorant Garamond', serif"
            fontWeight="400"
            fill="#F5F0E8"
            letterSpacing="6"
          >
            G·ARTISANS
          </text>
        </svg>
      );
    }

    // Compact version (default)
    return (
      <svg
        ref={ref}
        viewBox="0 0 300 120"
        width={width}
        height={height}
        className={className}
      >
        {/* Symbol: G in circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#C4532A"
          strokeWidth="2"
        />
        <text
          x="60"
          y="80"
          fontSize="60"
          fontFamily="'Cormorant Garamond', serif"
          fontWeight="300"
          fill="#1A2E20"
          textAnchor="middle"
        >
          G
        </text>

        {/* Wordmark */}
        <text
          x="170"
          y="80"
          fontSize={wordmarkSize}
          fontFamily="'Cormorant Garamond', serif"
          fontWeight="400"
          fill="#1A2E20"
          letterSpacing="6"
        >
          G·ARTISANS
        </text>
      </svg>
    );
  }
);

Logo.displayName = 'Logo';
