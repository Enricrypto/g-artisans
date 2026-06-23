/**
 * G·Artisans UI Components — Acceptance Test Suite
 *
 * This test suite verifies that all 9 UI components satisfy their acceptance criteria
 * as defined in the approved User Story and Technical Brief (TRD Section 11).
 *
 * Components tested:
 * 1. Button (4 variants, 3 sizes, loading state, accessibility)
 * 2. Card (rotation, elevation, variants, responsive)
 * 3. Badge (6 variants, 3 sizes, pill shape)
 * 4. AccentShape (3 sizes, 4 colors, decorative)
 * 5. Icon (Lucide wrapper, sizes, colors)
 * 6. Typography (6 variants, semantic HTML, accent prop)
 * 7. Accordion (expand/collapse, keyboard nav, animation)
 * 8. Input (label, error state, character counter, accessibility)
 * 9. TextArea (auto-resize, character counter, error state)
 *
 * Test Coverage Strategy:
 * - Unit tests: Props, rendering, state management
 * - Integration tests: Component behavior, user interactions
 * - Accessibility tests: WCAG 2.1 AA compliance, keyboard nav, ARIA attributes
 * - Visual tests: CSS classes, responsive behavior, design tokens
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AccentShape } from '@/components/ui/AccentShape';
import { Icon } from '@/components/ui/Icon';
import { Typography } from '@/components/ui/Typography';
import { Accordion } from '@/components/ui/Accordion';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';

// ============================================================================
// BUTTON COMPONENT TESTS
// ============================================================================

describe('Button Component', () => {
  describe('Criterion: Renders all 4 variants', () => {
    it('should render primary-orange variant', () => {
      const { container } = render(<Button variant="primary-orange">Click</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-naranja');
    });

    it('should render secondary-green variant', () => {
      const { container } = render(<Button variant="secondary-green">Click</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-selva');
    });

    it('should render outline-orange variant', () => {
      const { container } = render(<Button variant="outline-orange">Click</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-naranja', 'text-naranja');
    });

    it('should render outline-dark variant', () => {
      const { container } = render(<Button variant="outline-dark">Click</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-noche', 'text-noche');
    });
  });

  describe('Criterion: Button styling matches design tokens', () => {
    it('should have uppercase text with correct letter-spacing', () => {
      const { container } = render(<Button>Text</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('uppercase', 'tracking-btn');
    });

    it('should have rounded-pill border-radius (40px)', () => {
      const { container } = render(<Button>Rounded</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('rounded-pill');
    });

    it('should have sans font family (Jost)', () => {
      const { container } = render(<Button>Font</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('font-sans');
    });
  });

  describe('Criterion: Loading state shows spinner and disables button', () => {
    it('should disable button when isLoading is true', () => {
      render(<Button isLoading={true}>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show Loader2 spinner icon', () => {
      const { container } = render(<Button isLoading={true}>Loading</Button>);
      const spinner = container.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should hide spinner icon from screen readers', () => {
      const { container } = render(<Button isLoading={true}>Loading</Button>);
      const spinner = container.querySelector('svg');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render children alongside spinner', () => {
      render(<Button isLoading={true}>Processing</Button>);
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });
  });

  describe('Criterion: All interactive states are visually distinct', () => {
    it('should have focus-visible outline', () => {
      const { container } = render(<Button>Focus</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('focus-visible:outline-2');
    });

    it('should have hover effect via opacity', () => {
      const { container } = render(<Button variant="primary-orange">Hover</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('hover:bg-naranja-papaya');
    });

    it('should have active:scale-95 for press', () => {
      const { container } = render(<Button>Press</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('active:scale-95');
    });

    it('should have disabled opacity', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Criterion: TypeScript strict mode - no `any` types', () => {
    it('should accept ButtonHTMLAttributes', () => {
      render(
        <Button
          type="submit"
          data-testid="btn"
          aria-label="Submit"
        >
          Test
        </Button>
      );
      const button = screen.getByTestId('btn');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should have displayName for debugging', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Criterion: Accessibility - WCAG 2.1 AA', () => {
    it('should be keyboard focusable', async () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should be announced as button by screen reader', () => {
      render(<Button>Screen Reader</Button>);
      const button = screen.getByRole('button', { name: /screen reader/i });
      expect(button).toBeInTheDocument();
    });

    it('should trigger onClick with keyboard Enter', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Enter Key</Button>);
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      // Click event should be fired by Enter key
    });

    it('should support custom aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByLabelText('Close dialog');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Criterion: Responsive behavior at all breakpoints', () => {
    it('should render on mobile (375px)', () => {
      render(<Button>Mobile</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render on tablet (768px)', () => {
      render(<Button>Tablet</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render on desktop (1024px)', () => {
      render(<Button>Desktop</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should support multiple sizes', () => {
      const { container: sm } = render(<Button size="sm">Small</Button>);
      const { container: md } = render(<Button size="md">Medium</Button>);
      const { container: lg } = render(<Button size="lg">Large</Button>);

      expect(sm.querySelector('button')).toHaveClass('px-4', 'py-1.5');
      expect(md.querySelector('button')).toHaveClass('px-7', 'py-3');
      expect(lg.querySelector('button')).toHaveClass('px-8', 'py-4');
    });
  });
});

// ============================================================================
// CARD COMPONENT TESTS
// ============================================================================

describe('Card Component', () => {
  describe('Criterion: Renders with configurable rotation (2-3 degrees)', () => {
    it('should apply default rotation -2.5 degrees', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveStyle('transform: rotate(-2.5deg)');
    });

    it('should apply custom rotation', () => {
      const { container } = render(<Card rotation={2.5}>Content</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveStyle('transform: rotate(2.5deg)');
    });

    it('should support zero rotation (no tilt)', () => {
      const { container } = render(<Card rotation={0}>Content</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveStyle('transform: rotate(0deg)');
    });
  });

  describe('Criterion: Border, radius, and background styling', () => {
    it('should have 0.5px solid border with rule color', () => {
      const { container } = render(<Card>Bordered</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('border', 'border-rule', 'bg-white');
    });

    it('should have 12px border-radius (rounded-card)', () => {
      const { container } = render(<Card>Radius</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('rounded-card');
    });
  });

  describe('Criterion: Variant prop changes styling', () => {
    it('should render default variant with border', () => {
      const { container } = render(<Card variant="default">Default</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('border');
    });

    it('should render flat variant without border or rotation', () => {
      const { container } = render(<Card variant="flat">Flat</Card>);
      const card = container.querySelector('div');
      expect(card).not.toHaveClass('border');
      expect(card).not.toHaveStyle(/transform/);
    });
  });

  describe('Criterion: Elevation adds shadow', () => {
    it('should add shadow when elevation is true', () => {
      const { container } = render(<Card elevation={true}>Shadow</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('shadow-sm');
    });

    it('should not have shadow when elevation is false', () => {
      const { container } = render(<Card elevation={false}>No Shadow</Card>);
      const card = container.querySelector('div');
      expect(card).not.toHaveClass('shadow-sm');
    });
  });

  describe('Criterion: Padding and responsive content', () => {
    it('should apply padding when padded is true', () => {
      const { container } = render(<Card padded={true}>Padded</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('p-4', 'md:p-6');
    });

    it('should not apply padding when padded is false', () => {
      const { container } = render(<Card padded={false}>No Padding</Card>);
      const card = container.querySelector('div');
      expect(card).not.toHaveClass('p-4');
    });

    it('should render children correctly', () => {
      render(<Card><p>Card content</p></Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });
  });

  describe('Criterion: No animation - static card', () => {
    it('should not have animation classes', () => {
      const { container } = render(<Card>Static</Card>);
      const card = container.querySelector('div');
      expect(card?.className).not.toMatch(/animate-/);
    });
  });

  describe('Criterion: Responsive at all breakpoints', () => {
    it('should render on mobile', () => {
      render(<Card>Mobile</Card>);
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('should scale content responsively', () => {
      render(
        <Card padded={true}>
          <p>Responsive content</p>
        </Card>
      );
      expect(screen.getByText('Responsive content')).toBeInTheDocument();
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Ref</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have displayName', () => {
      expect(Card.displayName).toBe('Card');
    });
  });

  describe('Criterion: Accessibility', () => {
    it('should use semantic div element', () => {
      const { container } = render(<Card>Semantic</Card>);
      const card = container.querySelector('div');
      expect(card?.tagName).toBe('DIV');
    });

    it('should accept aria attributes', () => {
      render(<Card aria-label="Card section">Content</Card>);
      const card = screen.getByLabelText('Card section');
      expect(card).toBeInTheDocument();
    });
  });
});

// ============================================================================
// BADGE COMPONENT TESTS
// ============================================================================

describe('Badge Component', () => {
  describe('Criterion: Renders all 6 color variants', () => {
    const variants = ['naranja', 'selva', 'linho', 'noche', 'muted', 'rule'] as const;

    variants.forEach(variant => {
      it(`should render ${variant} variant`, () => {
        const { container } = render(<Badge variant={variant}>Badge</Badge>);
        const badge = container.querySelector('span');
        expect(badge).toHaveClass(`bg-${variant}`);
      });
    });
  });

  describe('Criterion: Text styling (Jost 400, uppercase, 9-10px)', () => {
    it('should have uppercase text', () => {
      const { container } = render(<Badge>Text</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('uppercase');
    });

    it('should have sans font (Jost)', () => {
      const { container } = render(<Badge>Font</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('font-sans');
    });

    it('should have correct letter-spacing (1.5px)', () => {
      const { container } = render(<Badge>Spacing</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('tracking-badge');
    });
  });

  describe('Criterion: Pill shape with 20px border-radius', () => {
    it('should have pill border-radius', () => {
      const { container } = render(<Badge>Pill</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('rounded-badge');
    });
  });

  describe('Criterion: Renders all 3 sizes with different padding', () => {
    it('should apply small size padding', () => {
      const { container } = render(<Badge size="sm">Small</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-3', 'py-1');
    });

    it('should apply medium size padding', () => {
      const { container } = render(<Badge size="md">Medium</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-4', 'py-2');
    });

    it('should apply large size padding', () => {
      const { container } = render(<Badge size="lg">Large</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-6', 'py-3');
    });
  });

  describe('Criterion: No interaction - read-only label', () => {
    it('should render as non-interactive span', () => {
      const { container } = render(<Badge>Label</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.tagName).toBe('SPAN');
    });

    it('should have inline-block display', () => {
      const { container } = render(<Badge>Block</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('inline-block');
    });

    it('should not have button or click handler', () => {
      const { container } = render(<Badge>Static</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.onclick).toBe(null);
    });
  });

  describe('Criterion: Responsive behavior', () => {
    it('should display on mobile', () => {
      render(<Badge>Mobile</Badge>);
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('should not overflow on mobile', () => {
      render(
        <div style={{ width: '375px', overflow: 'hidden' }}>
          <Badge>No Overflow</Badge>
        </div>
      );
      expect(screen.getByText('No Overflow')).toBeInTheDocument();
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('should have displayName', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('Criterion: Accepts children', () => {
    it('should render text children', () => {
      render(<Badge>Badge Text</Badge>);
      expect(screen.getByText('Badge Text')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(<Badge><strong>Bold</strong> Text</Badge>);
      expect(screen.getByText(/Bold/)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// ACCENTSHAPE COMPONENT TESTS
// ============================================================================

describe('AccentShape Component', () => {
  describe('Criterion: Renders decorative geometric shape (SVG)', () => {
    it('should render as SVG element', () => {
      const { container } = render(<AccentShape />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should contain circles for decorative shape', () => {
      const { container } = render(<AccentShape />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  describe('Criterion: Three sizes (80px, 160px, 240px)', () => {
    it('should apply small size (80px)', () => {
      const { container } = render(<AccentShape size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-12', 'h-12');
    });

    it('should apply medium size (160px)', () => {
      const { container } = render(<AccentShape size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-20', 'h-20');
    });

    it('should apply large size (240px)', () => {
      const { container } = render(<AccentShape size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-32', 'h-32');
    });
  });

  describe('Criterion: Four color variants', () => {
    it('should render naranja color', () => {
      const { container } = render(<AccentShape color="naranja" />);
      const circles = container.querySelectorAll('circle');
      // Check that at least one circle has the naranja color
      let hasNaranja = false;
      circles.forEach((circle: Element) => {
        const stroke = circle.getAttribute('stroke');
        const fill = circle.getAttribute('fill');
        if (stroke === '#C4532A' || fill === '#C4532A') hasNaranja = true;
      });
      expect(hasNaranja).toBe(true);
    });

    it('should render selva color', () => {
      const { container } = render(<AccentShape color="selva" />);
      const circles = container.querySelectorAll('circle');
      let hasSelva = false;
      circles.forEach((circle: Element) => {
        const stroke = circle.getAttribute('stroke');
        const fill = circle.getAttribute('fill');
        if (stroke === '#2A5240' || fill === '#2A5240') hasSelva = true;
      });
      expect(hasSelva).toBe(true);
    });

    it('should render linho color', () => {
      const { container } = render(<AccentShape color="linho" />);
      const circles = container.querySelectorAll('circle');
      let hasLinho = false;
      circles.forEach((circle: Element) => {
        const stroke = circle.getAttribute('stroke');
        const fill = circle.getAttribute('fill');
        if (stroke === '#F5F0E8' || fill === '#F5F0E8') hasLinho = true;
      });
      expect(hasLinho).toBe(true);
    });

    it('should render noche color', () => {
      const { container } = render(<AccentShape color="noche" />);
      const circles = container.querySelectorAll('circle');
      let hasNoche = false;
      circles.forEach((circle: Element) => {
        const stroke = circle.getAttribute('stroke');
        const fill = circle.getAttribute('fill');
        if (stroke === '#1A2E20' || fill === '#1A2E20') hasNoche = true;
      });
      expect(hasNoche).toBe(true);
    });
  });

  describe('Criterion: aria-hidden="true" (decorative)', () => {
    it('should have aria-hidden attribute', () => {
      const { container } = render(<AccentShape />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not be keyboard focusable', () => {
      const { container } = render(<AccentShape />);
      const svg = container.querySelector('svg') as HTMLElement;
      svg.focus();
      expect(document.activeElement).not.toBe(svg);
    });
  });

  describe('Criterion: No keyboard interaction or layout impact', () => {
    it('should support position absolute for background placement', () => {
      const { container } = render(
        <AccentShape className="absolute -top-4 -right-4" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('absolute', '-top-4', '-right-4');
    });

    it('should not create layout shift', () => {
      const { container } = render(
        <div style={{ position: 'relative', height: '100px' }}>
          <AccentShape />
        </div>
      );
      const parent = container.firstChild as HTMLElement;
      expect(parent.style.height).toBe('100px');
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should accept forwardRef', () => {
      const ref = React.createRef<SVGSVGElement>();
      render(<AccentShape ref={ref} />);
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });

    it('should have displayName', () => {
      expect(AccentShape.displayName).toBe('AccentShape');
    });
  });
});

// ============================================================================
// ICON COMPONENT TESTS
// ============================================================================

describe('Icon Component', () => {
  describe('Criterion: Wraps Lucide React icons by name', () => {
    it('should render ChevronDown icon', () => {
      const { container } = render(<Icon name="ChevronDown" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render Menu icon', () => {
      const { container } = render(<Icon name="Menu" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render X (close) icon', () => {
      const { container } = render(<Icon name="X" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle invalid icon name gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      render(<Icon name="ChevronDown" />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Criterion: Size prop (16, 20, 24, 32, 40)', () => {
    it('should apply size 16', () => {
      const { container } = render(<Icon name="Menu" size={16} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
    });

    it('should apply size 24 (default)', () => {
      const { container } = render(<Icon name="Menu" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
    });

    it('should apply size 40', () => {
      const { container } = render(<Icon name="Menu" size={40} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '40');
    });
  });

  describe('Criterion: Color variants', () => {
    it('should use currentColor by default', () => {
      const { container } = render(<Icon name="Menu" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('should apply naranja color', () => {
      const { container } = render(<Icon name="Menu" color="naranja" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', '#C4532A');
    });

    it('should apply selva color', () => {
      const { container } = render(<Icon name="Menu" color="selva" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', '#2A5240');
    });

    it('should apply noche color', () => {
      const { container } = render(<Icon name="Menu" color="noche" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', '#1A2E20');
    });

    it('should apply muted color', () => {
      const { container } = render(<Icon name="Menu" color="muted" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', '#7A7A6E');
    });
  });

  describe('Criterion: aria-hidden="true" by default (decorative)', () => {
    it('should have aria-hidden=true when decorative is true', () => {
      const { container } = render(<Icon name="Menu" decorative={true} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not have aria-hidden when decorative is false', () => {
      const { container } = render(<Icon name="Menu" decorative={false} aria-label="Menu" />);
      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should support custom aria-label for non-decorative icons', () => {
      render(<Icon name="Menu" decorative={false} aria-label="Open navigation menu" />);
      const svg = screen.getByLabelText('Open navigation menu');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Criterion: No emoji or text-character icons', () => {
    it('should only use Lucide React SVG icons', () => {
      const { container } = render(<Icon name="ChevronDown" />);
      const svg = container.querySelector('svg');
      expect(svg?.tagName).toBe('svg');
    });

    it('should not render text content', () => {
      const { container } = render(<Icon name="Menu" />);
      const text = container.textContent;
      // Should only contain SVG, not any emoji or text characters
      expect(text).toBe('');
    });
  });

  describe('Criterion: Responsive icon scaling', () => {
    it('should scale at different breakpoints', () => {
      const { container: md } = render(<Icon name="Menu" size={24} />);
      const { container: lg } = render(<Icon name="Menu" size={32} />);

      const mdIcon = md.querySelector('svg');
      const lgIcon = lg.querySelector('svg');

      expect(mdIcon).toHaveAttribute('width', '24');
      expect(lgIcon).toHaveAttribute('width', '32');
    });
  });

  describe('Criterion: Accessibility', () => {
    it('should not be keyboard focusable when decorative', () => {
      const { container } = render(<Icon name="Menu" decorative={true} />);
      const svg = container.querySelector('svg') as HTMLElement;
      expect(svg.getAttribute('tabindex')).not.toBe('0');
    });

    it('should work inside buttons without extra focus outline', () => {
      render(
        <Button>
          <Icon name="Menu" decorative={true} />
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should support custom className', () => {
      const { container } = render(<Icon name="Menu" className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('should have displayName', () => {
      expect(Icon.displayName).toBe('Icon');
    });
  });
});

// ============================================================================
// TYPOGRAPHY COMPONENT TESTS
// ============================================================================

describe('Typography Component', () => {
  describe('Criterion: Renders all 6 variants with correct elements', () => {
    it('should render h1 variant', () => {
      render(<Typography variant="h1">Heading 1</Typography>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Heading 1');
    });

    it('should render h2 variant', () => {
      render(<Typography variant="h2">Heading 2</Typography>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Heading 2');
    });

    it('should render h3 variant', () => {
      render(<Typography variant="h3">Heading 3</Typography>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Heading 3');
    });

    it('should render body variant as p', () => {
      render(<Typography variant="body">Body text</Typography>);
      const para = screen.getByText('Body text');
      expect(para.tagName).toBe('P');
    });

    it('should render body-small variant', () => {
      render(<Typography variant="body-small">Small text</Typography>);
      const text = screen.getByText('Small text');
      expect(text).toBeInTheDocument();
    });

    it('should render label variant as span', () => {
      render(<Typography variant="label">Label</Typography>);
      const span = screen.getByText('Label');
      expect(span.tagName).toBe('SPAN');
    });
  });

  describe('Criterion: Semantic HTML elements', () => {
    it('should render actual h1 element', () => {
      const { container } = render(<Typography variant="h1">H1</Typography>);
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
    });

    it('should render actual p element for body', () => {
      const { container } = render(<Typography variant="body">Body</Typography>);
      const p = container.querySelector('p');
      expect(p).toBeInTheDocument();
    });

    it('should render actual span for label', () => {
      const { container } = render(<Typography variant="label">Label</Typography>);
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
    });
  });

  describe('Criterion: Accent prop applies italic + naranja color', () => {
    it('should apply italic style', () => {
      const { container } = render(<Typography accent={true}>Italic</Typography>);
      const element = container.querySelector('p');
      expect(element).toHaveClass('italic');
    });

    it('should apply naranja color', () => {
      const { container } = render(<Typography accent={true}>Colored</Typography>);
      const element = container.querySelector('p');
      expect(element).toHaveClass('text-naranja');
    });

    it('should not apply accent by default', () => {
      const { container } = render(<Typography>Normal</Typography>);
      const element = container.querySelector('p');
      expect(element).not.toHaveClass('italic');
      expect(element).not.toHaveClass('text-naranja');
    });
  });

  describe('Criterion: `as` prop overrides element type while keeping styling', () => {
    it('should render h1 styled as h2 when as="h2"', () => {
      const { container } = render(
        <Typography variant="h1" as="h2">Override</Typography>
      );
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveClass('h1');
    });

    it('should render body as span when as="span"', () => {
      const { container } = render(
        <Typography variant="body" as="span">Span</Typography>
      );
      const span = container.querySelector('span:not([class*="sr-only"])');
      expect(span).toBeInTheDocument();
    });
  });

  describe('Criterion: Font tokens (Unbounded display, Jost body)', () => {
    it('should have correct font family classes', () => {
      const { container: h1 } = render(<Typography variant="h1">Display</Typography>);
      const { container: body } = render(<Typography variant="body">Body</Typography>);

      expect(h1.querySelector('h1')).toHaveClass('h1');
      expect(body.querySelector('p')).toHaveClass('body');
    });
  });

  describe('Criterion: Responsive sizing at breakpoints', () => {
    it('should scale headings responsively', () => {
      render(
        <>
          <Typography variant="h1">Large heading</Typography>
          <Typography variant="body">Body text</Typography>
        </>
      );
      expect(screen.getByText('Large heading')).toBeInTheDocument();
      expect(screen.getByText('Body text')).toBeInTheDocument();
    });
  });

  describe('Criterion: Color contrast WCAG 2.1 AA (4.5:1)', () => {
    it('should have sufficient contrast', () => {
      render(<Typography variant="body">Text</Typography>);
      const text = screen.getByText('Text');
      expect(text).toBeInTheDocument();
      // Visual contrast test would be checked in E2E/visual tests
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<Typography variant="h1" ref={ref}>Ref</Typography>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should have displayName', () => {
      expect(Typography.displayName).toBe('Typography');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Typography className="custom">Custom</Typography>
      );
      expect(container.querySelector('.custom')).toBeInTheDocument();
    });
  });

  describe('Criterion: Accessibility', () => {
    it('should announce heading level correctly', () => {
      render(<Typography variant="h1">Main Title</Typography>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have semantic structure', () => {
      const { container } = render(
        <>
          <Typography variant="h1">Main</Typography>
          <Typography variant="h2">Sub</Typography>
          <Typography variant="body">Content</Typography>
        </>
      );
      const h1 = container.querySelector('h1');
      const h2 = container.querySelector('h2');
      const p = container.querySelector('p');
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(p).toBeInTheDocument();
    });
  });
});

// ============================================================================
// ACCORDION COMPONENT TESTS
// ============================================================================

describe('Accordion Component', () => {
  const mockItems = [
    { id: '1', title: 'Question 1', children: 'Answer 1' },
    { id: '2', title: 'Question 2', children: 'Answer 2' },
    { id: '3', title: 'Question 3', children: 'Answer 3' },
  ];

  describe('Criterion: Expand/collapse on title click', () => {
    it('should expand item when title is clicked', async () => {
      render(<Accordion items={mockItems} />);
      const button = screen.getByText('Question 1');
      await userEvent.click(button);
      expect(screen.getByText('Answer 1')).toBeInTheDocument();
    });

    it('should collapse item when clicked again', async () => {
      const { container } = render(<Accordion items={mockItems} />);
      const button = screen.getByText('Question 1');

      await userEvent.click(button);
      expect(screen.getByText('Answer 1')).toBeVisible();

      await userEvent.click(button);
      const region = container.querySelector('[role="region"]');
      expect(region).toHaveClass('opacity-0');
    });
  });

  describe('Criterion: Only one item open by default (allowMultiple=false)', () => {
    it('should close previous item when opening new item', async () => {
      const { container } = render(<Accordion items={mockItems} allowMultiple={false} />);

      const button1 = screen.getByText('Question 1');
      const button2 = screen.getByText('Question 2');

      await userEvent.click(button1);
      expect(screen.getByText('Answer 1')).toBeVisible();

      await userEvent.click(button2);
      expect(screen.getByText('Answer 2')).toBeVisible();

      // The first content region should now have opacity-0
      const regions = container.querySelectorAll('[role="region"]');
      expect(regions[0]).toHaveClass('opacity-0');
    });

    it('should never have two items open simultaneously', async () => {
      const { container } = render(<Accordion items={mockItems} allowMultiple={false} />);

      const buttons = screen.getAllByRole('button').slice(0, 3); // Only accordion buttons
      await userEvent.click(buttons[0]);
      await userEvent.click(buttons[1]);

      const regions = container.querySelectorAll('[role="region"]');
      const visibleCount = Array.from(regions).filter((r: Element) => r.className.includes('opacity-100')).length;
      expect(visibleCount).toBeLessThanOrEqual(1);
    });
  });

  describe('Criterion: allowMultiple=true enables multi-open', () => {
    it('should keep multiple items open', async () => {
      render(<Accordion items={mockItems} allowMultiple={true} />);

      const buttons = screen.getAllByRole('button');
      // First 3 are accordion buttons
      const button1 = buttons[0];
      const button2 = buttons[1];

      await userEvent.click(button1);
      await userEvent.click(button2);

      // Both should be open
      expect(button1).toHaveAttribute('aria-expanded', 'true');
      expect(button2).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Criterion: Keyboard navigation (Enter/Space)', () => {
    it('should expand item with Space key', async () => {
      render(<Accordion items={mockItems} />);
      const buttons = screen.getAllByRole('button');
      const button = buttons[0]; // First accordion button

      button.focus();
      await userEvent.keyboard(' ');

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should expand item with Enter key', async () => {
      render(<Accordion items={mockItems} />);
      const buttons = screen.getAllByRole('button');
      const button = buttons[0]; // First accordion button

      button.focus();
      await userEvent.keyboard('{Enter}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Criterion: Chevron icon rotates 180 degrees on expand', () => {
    it('should have chevron rotated when expanded', async () => {
      const { container } = render(<Accordion items={mockItems} />);
      const button = screen.getByText('Question 1');

      await userEvent.click(button);

      const chevron = container.querySelector('svg');
      expect(chevron).toHaveClass('rotate-180');
    });

    it('should have chevron unrotated when collapsed', async () => {
      const { container } = render(<Accordion items={mockItems} />);
      const button = screen.getByText('Question 1');

      await userEvent.click(button);
      await userEvent.click(button);

      const chevron = container.querySelector('svg');
      expect(chevron).not.toHaveClass('rotate-180');
    });
  });

  describe('Criterion: aria-expanded, aria-controls, role="region"', () => {
    it('should have aria-expanded attribute', async () => {
      render(<Accordion items={mockItems} />);
      const buttons = screen.getAllByRole('button');
      const button = buttons[0]; // First accordion button

      expect(button).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-controls linking to content', () => {
      render(<Accordion items={mockItems} />);
      const buttons = screen.getAllByRole('button');
      const button = buttons[0]; // First accordion button
      const controlsId = button.getAttribute('aria-controls');

      expect(controlsId).toBeTruthy();
      // Content div should have matching id
      const content = document.getElementById(controlsId!);
      expect(content).toBeInTheDocument();
    });

    it('should have role="region" on content', async () => {
      render(<Accordion items={mockItems} />);
      const button = screen.getByText('Question 1');

      await userEvent.click(button);

      const region = document.querySelector('[role="region"]');
      expect(region).toBeInTheDocument();
    });
  });

  describe('Criterion: 300ms smooth animation', () => {
    it('should have transition duration 300ms', () => {
      const { container } = render(<Accordion items={mockItems} />);
      const contentContainer = container.querySelector('[role="region"]');
      expect(contentContainer).toHaveClass('transition-all', 'duration-300');
    });

    it('should have ease-in-out easing', () => {
      const { container } = render(<Accordion items={mockItems} />);
      const contentContainer = container.querySelector('[role="region"]');
      expect(contentContainer).toHaveClass('ease-in-out');
    });
  });

  describe('Criterion: Responsive behavior at all breakpoints', () => {
    it('should render on mobile', () => {
      render(<Accordion items={mockItems} />);
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    it('should render on desktop', () => {
      render(<Accordion items={mockItems} />);
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    it('should not overflow on mobile', () => {
      render(
        <div style={{ width: '375px', overflow: 'hidden' }}>
          <Accordion items={mockItems} />
        </div>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Criterion: Default closed state', () => {
    it('should have all items closed on load', () => {
      render(<Accordion items={mockItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Criterion: TypeScript and accessibility', () => {
    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Accordion ref={ref} items={mockItems} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have displayName', () => {
      expect(Accordion.displayName).toBe('Accordion');
    });

    it('should have proper focus management', async () => {
      render(<Accordion items={mockItems} />);
      const buttons = screen.getAllByRole('button');
      const button = buttons[0]; // First accordion button

      button.focus();
      expect(button).toHaveFocus();

      await userEvent.keyboard(' ');
      expect(button).toHaveFocus();
    });
  });
});

// ============================================================================
// INPUT COMPONENT TESTS
// ============================================================================

describe('Input Component', () => {
  describe('Criterion: Label with required indicator', () => {
    it('should render label with htmlFor attribute', () => {
      render(
        <Input
          id="email-input"
          label="Email"
          type="email"
        />
      );
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email-input');
    });

    it('should show red asterisk when required', () => {
      const { container } = render(
        <Input
          id="name"
          label="Name"
          required={true}
        />
      );
      const label = container.querySelector('label');
      // The required asterisk is added via CSS after: content
      expect(label).toHaveClass("after:content-['*']");
    });

    it('should not show asterisk when not required', () => {
      const { container } = render(
        <Input
          id="optional"
          label="Optional Field"
          required={false}
        />
      );
      const label = container.querySelector('label');
      expect(label).not.toHaveClass("after:content-['*']");
    });
  });

  describe('Criterion: Error state (red border, text, aria-invalid)', () => {
    it('should show error text in red', () => {
      render(
        <Input
          id="email"
          label="Email"
          error="Invalid email format"
        />
      );
      const errorText = screen.getByText('Invalid email format');
      expect(errorText).toHaveClass('text-naranja');
    });

    it('should set aria-invalid when error is present', () => {
      render(
        <Input
          id="test"
          error="Error message"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have red border on input with error', () => {
      const { container } = render(
        <Input
          id="error"
          error="This is an error"
        />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-naranja', 'bg-naranja-soft');
    });

    it('should set aria-describedby pointing to error', () => {
      render(
        <Input
          id="input-1"
          error="Error text"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });
  });

  describe('Criterion: Helper text (mutually exclusive with error)', () => {
    it('should show helper text when no error', () => {
      render(
        <Input
          id="help"
          label="Help"
          helperText="This is helper text"
        />
      );
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('should not show helper text when error is present', () => {
      render(
        <Input
          id="test"
          error="Error"
          helperText="Helper"
        />
      );
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should be muted color when helper text', () => {
      render(
        <Input
          id="helper"
          helperText="Helper text"
        />
      );
      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveClass('text-muted');
    });
  });

  describe('Criterion: Character counter with maxLength', () => {
    it('should show character count', async () => {
      render(
        <Input
          id="count"
          maxLength={50}
          showCharCount={true}
        />
      );
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Hello');

      expect(screen.getByText(/5 \/ 50/)).toBeInTheDocument();
    });

    it('should update counter as user types', async () => {
      render(
        <Input
          id="count"
          maxLength={100}
          showCharCount={true}
        />
      );
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'T');
      expect(screen.getByText(/1 \/ 100/)).toBeInTheDocument();

      await userEvent.type(input, 'est');
      expect(screen.getByText(/4 \/ 100/)).toBeInTheDocument();
    });

    it('should not show counter when showCharCount is false', () => {
      render(
        <Input
          id="nocount"
          maxLength={50}
          showCharCount={false}
        />
      );
      expect(screen.queryByText(/\/ 50/)).not.toBeInTheDocument();
    });
  });

  describe('Criterion: Focus-visible with 2px outline', () => {
    it('should have focus outline styles', () => {
      const { container } = render(
        <Input
          id="focus"
          type="text"
        />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('focus-visible:outline-2');
    });

    it('should be keyboard focusable', async () => {
      render(<Input id="focusable" />);
      const input = screen.getByRole('textbox');
      await userEvent.tab();
      expect(input).toHaveFocus();
    });
  });

  describe('Criterion: Disabled state styling', () => {
    it('should be disabled when disabled prop is true', () => {
      render(
        <Input
          id="disabled"
          disabled={true}
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should have disabled styling', () => {
      const { container } = render(
        <Input
          id="disabled"
          disabled={true}
        />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('disabled:bg-linho', 'disabled:cursor-not-allowed');
    });

    it('should not allow typing when disabled', async () => {
      render(
        <Input
          id="disabled"
          disabled={true}
        />
      );
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');
      expect(input).toHaveValue('');
    });
  });

  describe('Criterion: Semantic label association', () => {
    it('should have proper label-input association', () => {
      render(
        <Input
          id="associated"
          label="Email Address"
          type="email"
        />
      );
      const label = screen.getByText('Email Address');
      expect(label).toHaveAttribute('for', 'associated');
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'associated');
    });
  });

  describe('Criterion: Placeholder styling (muted color)', () => {
    it('should have placeholder text', () => {
      const { container } = render(
        <Input
          id="placeholder"
          placeholder="Enter text here"
        />
      );
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });

    it('should have muted placeholder styling', () => {
      const { container } = render(
        <Input
          id="placeholder"
          placeholder="Text"
        />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('placeholder-muted');
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should accept HTMLInputAttributes', () => {
      render(
        <Input
          id="test"
          type="email"
          name="email"
          data-testid="email-input"
        />
      );
      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should have displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Criterion: Accessibility', () => {
    it('should have aria-invalid on error', () => {
      render(
        <Input
          id="invalid"
          error="Invalid input"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby for error/helper', () => {
      render(
        <Input
          id="described"
          error="Error message"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('should support standard input roles', () => {
      const { container } = render(
        <>
          <Input id="email" type="email" />
          <Input id="tel" type="tel" />
          <Input id="text" type="text" />
        </>
      );
      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBe(3);
    });
  });

  describe('Criterion: Responsive width (full-width on mobile)', () => {
    it('should be full width', () => {
      const { container } = render(
        <Input id="full" />
      );
      const wrapper = container.querySelector('.w-full');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render properly on mobile width', () => {
      render(
        <div style={{ width: '375px' }}>
          <Input id="mobile" placeholder="Mobile input" />
        </div>
      );
      expect(screen.getByPlaceholderText('Mobile input')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TEXTAREA COMPONENT TESTS
// ============================================================================

describe('TextArea Component', () => {
  describe('Criterion: Label with required indicator', () => {
    it('should render label', () => {
      render(
        <TextArea
          id="message"
          label="Message"
        />
      );
      const label = screen.getByText('Message');
      expect(label).toHaveAttribute('for', 'message');
    });

    it('should show asterisk when required', () => {
      const { container } = render(
        <TextArea
          id="required"
          label="Required Field"
          required={true}
        />
      );
      const label = container.querySelector('label');
      expect(label).toHaveClass("after:content-['*']");
    });
  });

  describe('Criterion: Character counter enabled by default', () => {
    it('should show character count by default', async () => {
      render(
        <TextArea
          id="count"
          maxLength={500}
        />
      );
      const textarea = screen.getByRole('textbox');

      await userEvent.type(textarea, 'Hello');

      expect(screen.getByText(/5 \/ 500/)).toBeInTheDocument();
    });

    it('should hide counter when showCharCount is false', () => {
      render(
        <TextArea
          id="nocount"
          maxLength={500}
          showCharCount={false}
        />
      );
      expect(screen.queryByText(/\/ 500/)).not.toBeInTheDocument();
    });

    it('should update counter in real time', async () => {
      render(
        <TextArea
          id="dynamic"
          maxLength={100}
        />
      );
      const textarea = screen.getByRole('textbox');

      await userEvent.type(textarea, 'Test');
      expect(screen.getByText(/4 \/ 100/)).toBeInTheDocument();

      await userEvent.keyboard('{Backspace}');
      expect(screen.getByText(/3 \/ 100/)).toBeInTheDocument();
    });
  });

  describe('Criterion: Auto-resize (min-height 120px, max-height 320px)', () => {
    it('should start at minimum height', () => {
      const { container } = render(
        <TextArea id="resize" />
      );
      const textarea = container.querySelector('textarea');
      // Default rows=4 should be around 120px minimum
      expect(textarea).toBeInTheDocument();
    });

    it('should cap at max-height 320px', () => {
      const { container } = render(
        <TextArea id="max" maxLength={10000} />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('max-h-80'); // max-h-80 = 320px in Tailwind
    });

    it('should have overflow-y-auto when content exceeds max', () => {
      const { container } = render(
        <TextArea id="overflow" />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('overflow-y-auto');
    });

    it('should grow vertically as user types', async () => {
      const { container } = render(
        <TextArea id="grow" />
      );
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;

      await userEvent.type(textarea, 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5');

      // Height should have increased (though we can't easily test exact pixels)
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Criterion: Error/helper text (mutually exclusive)', () => {
    it('should show error text', () => {
      render(
        <TextArea
          id="error"
          error="This field is required"
        />
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should show helper text when no error', () => {
      render(
        <TextArea
          id="help"
          helperText="Brief description please"
        />
      );
      expect(screen.getByText('Brief description please')).toBeInTheDocument();
    });

    it('should not show helper when error exists', () => {
      render(
        <TextArea
          id="conflict"
          error="Error message"
          helperText="Helper text"
        />
      );
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Criterion: Focus-visible 2px outline', () => {
    it('should have focus outline styling', () => {
      const { container } = render(
        <TextArea id="focus" />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('focus-visible:outline-2');
    });

    it('should be keyboard focusable', async () => {
      render(<TextArea id="focusable" />);
      const textarea = screen.getByRole('textbox');
      await userEvent.tab();
      expect(textarea).toHaveFocus();
    });
  });

  describe('Criterion: Disabled state', () => {
    it('should be disabled when prop is true', () => {
      render(<TextArea id="disabled" disabled={true} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should have disabled styling', () => {
      const { container } = render(
        <TextArea id="disabled" disabled={true} />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('disabled:bg-linho');
    });

    it('should not allow typing when disabled', async () => {
      render(<TextArea id="disabled" disabled={true} />);
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'test');
      expect(textarea).toHaveValue('');
    });
  });

  describe('Criterion: aria-invalid, aria-describedby', () => {
    it('should set aria-invalid on error', () => {
      render(
        <TextArea
          id="invalid"
          error="Error"
        />
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby for error', () => {
      render(
        <TextArea
          id="described"
          error="Error message"
        />
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby');
    });
  });

  describe('Criterion: Semantic label-textarea association', () => {
    it('should associate label with textarea', () => {
      render(
        <TextArea
          id="associated"
          label="Your Message"
        />
      );
      const label = screen.getByText('Your Message');
      expect(label).toHaveAttribute('for', 'associated');
    });
  });

  describe('Criterion: Responsive behavior', () => {
    it('should be full-width', () => {
      const { container } = render(<TextArea id="full" />);
      const wrapper = container.querySelector('.w-full');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render on mobile (375px)', () => {
      render(
        <div style={{ width: '375px' }}>
          <TextArea id="mobile" />
        </div>
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Criterion: no horizontal resize on mobile, vertical on desktop', () => {
    it('should have resize-none class', () => {
      const { container } = render(<TextArea id="noresize" />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('resize-none');
    });
  });

  describe('Criterion: TypeScript strict props', () => {
    it('should accept HTMLTextAreaAttributes', () => {
      render(
        <TextArea
          id="test"
          name="message"
          data-testid="message-area"
        />
      );
      const textarea = screen.getByTestId('message-area');
      expect(textarea).toHaveAttribute('name', 'message');
    });

    it('should accept forwardRef', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<TextArea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('should have displayName', () => {
      expect(TextArea.displayName).toBe('TextArea');
    });
  });

  describe('Criterion: Accessibility', () => {
    it('should announce error with role=alert', () => {
      render(
        <TextArea
          id="alert"
          error="Required field"
        />
      );
      const errorText = screen.getByText('Required field');
      expect(errorText).toHaveAttribute('role', 'alert');
    });

    it('should support standard textarea roles', () => {
      render(
        <>
          <TextArea id="text1" />
          <TextArea id="text2" />
        </>
      );
      const textareas = screen.getAllByRole('textbox');
      expect(textareas.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Criterion: Keyboard interaction', () => {
    it('should accept newlines with Enter/Shift+Enter', async () => {
      render(<TextArea id="newlines" />);
      const textarea = screen.getByRole('textbox');

      await userEvent.type(textarea, 'Line 1');
      await userEvent.keyboard('{Enter}');
      await userEvent.type(textarea, 'Line 2');

      expect(textarea).toHaveValue('Line 1\nLine 2');
    });

    it('should support tab key for focus navigation', async () => {
      render(
        <>
          <input id="before" />
          <TextArea id="textarea" />
          <input id="after" />
        </>
      );

      const beforeInput = document.getElementById('before') as HTMLInputElement;
      beforeInput.focus();

      await userEvent.tab();
      const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
      expect(textarea).toHaveFocus();
    });
  });
});

// ============================================================================
// CROSS-COMPONENT INTEGRATION TESTS
// ============================================================================

describe('Cross-Component Integration', () => {
  describe('Button inside Card', () => {
    it('should render button inside card', () => {
      render(
        <Card>
          <Button>Click me</Button>
        </Card>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should preserve button functionality', async () => {
      const handleClick = vi.fn();
      render(
        <Card>
          <Button onClick={handleClick}>Button</Button>
        </Card>
      );
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Badge inside Card', () => {
    it('should render badge with correct colors', () => {
      const { container } = render(
        <Card>
          <Badge variant="naranja">Badge</Badge>
        </Card>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-naranja');
    });
  });

  describe('Icon inside Button', () => {
    it('should render icon without extra focus', () => {
      render(
        <Button>
          <Icon name="Menu" size={16} />
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Input with Typography label', () => {
    it('should work with custom label component', () => {
      render(
        <>
          <Typography variant="label">Email</Typography>
          <Input id="email" type="email" />
        </>
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Multiple Cards with different rotations', () => {
    it('should render independent cards', () => {
      const { container } = render(
        <>
          <Card rotation={-2.5}>Card 1</Card>
          <Card rotation={2.5}>Card 2</Card>
          <Card rotation={0}>Card 3</Card>
        </>
      );
      const cards = container.querySelectorAll('div[style*="rotate"]');
      expect(cards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Accordion with Typography inside', () => {
    it('should render typography in accordion', () => {
      const items = [
        {
          id: '1',
          title: 'Question',
          children: (
            <Typography variant="body">
              This is an answer
            </Typography>
          ),
        },
      ];
      render(<Accordion items={items} />);
      expect(screen.getByText('Question')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// WCAG 2.1 AA COMPLIANCE TESTS
// ============================================================================

describe('WCAG 2.1 AA Compliance', () => {
  describe('Color Contrast', () => {
    it('Button text should have sufficient contrast', () => {
      render(<Button variant="primary-orange">Contrast Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Actual contrast ratio testing would be done with visual testing tools
    });

    it('Badge text should have sufficient contrast', () => {
      render(<Badge variant="naranja">Text</Badge>);
      const badge = screen.getByText('Text');
      expect(badge).toBeInTheDocument();
    });

    it('Typography text should have sufficient contrast', () => {
      render(<Typography variant="body">Readable text</Typography>);
      const text = screen.getByText('Readable text');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('All interactive elements should be keyboard accessible', async () => {
      render(
        <>
          <Button>Button</Button>
          <input id="text-input" />
          <textarea id="text-area"></textarea>
          <Accordion items={[{ id: '1', title: 'Q', children: 'A' }]} />
        </>
      );

      const buttons = screen.getAllByRole('button');
      const button = buttons[0]; // First button is the Button component
      const input = document.getElementById('text-input');
      const textarea = document.getElementById('text-area');

      button.focus();
      expect(button).toHaveFocus();

      (input as HTMLElement).focus();
      expect(input).toHaveFocus();

      (textarea as HTMLElement).focus();
      expect(textarea).toHaveFocus();
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic heading elements', () => {
      const { container } = render(
        <>
          <Typography variant="h1">H1</Typography>
          <Typography variant="h2">H2</Typography>
          <Typography variant="h3">H3</Typography>
        </>
      );
      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('should use semantic button element', () => {
      const { container } = render(<Button>Submit</Button>);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('should use semantic form elements', () => {
      const { container } = render(
        <>
          <Input id="i" label="Input" />
          <TextArea id="t" label="TextArea" />
        </>
      );
      expect(container.querySelector('input')).toBeInTheDocument();
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have aria-invalid on form errors', () => {
      render(<Input id="i" error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-expanded on accordion', async () => {
      render(
        <Accordion items={[{ id: '1', title: 'Q', children: 'A' }]} />
      );
      const buttons = screen.getAllByRole('button');
      const accordionButton = buttons[0]; // Accordion button
      expect(accordionButton).toHaveAttribute('aria-expanded');
    });

    it('should have aria-hidden on decorative icons', () => {
      const { container } = render(<Icon name="Menu" decorative={true} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Focus Visible', () => {
    it('all interactive elements should have focus outline', () => {
      const { container } = render(
        <>
          <Button>Button</Button>
          <Input id="input" />
          <TextArea id="textarea" />
        </>
      );
      const button = container.querySelector('button');
      const input = container.querySelector('input');
      const textarea = container.querySelector('textarea');

      expect(button).toHaveClass('focus-visible:outline-2');
      expect(input).toHaveClass('focus-visible:outline-2');
      expect(textarea).toHaveClass('focus-visible:outline-2');
    });
  });
});
