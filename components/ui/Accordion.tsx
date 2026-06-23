'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  /**
   * Unique identifier for the accordion item
   */
  id: string;
  /**
   * Title displayed in the accordion header
   */
  title: string;
  /**
   * Content displayed when expanded
   */
  children: React.ReactNode;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of accordion items
   */
  items: AccordionItemProps[];
  /**
   * Allow multiple items to be open simultaneously
   * @default false
   */
  allowMultiple?: boolean;
}

/**
 * Accordion Component
 *
 * Renders an accordion with expand/collapse animation.
 * Supports single or multiple open items.
 * Animation duration: 300ms
 *
 * @example
 * <Accordion
 *   items={[
 *     { id: '1', title: 'Question 1', children: 'Answer 1' },
 *     { id: '2', title: 'Question 2', children: 'Answer 2' },
 *   ]}
 * />
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple = false,
      className,
      ...props
    },
    ref
  ) => {
    const [openIds, setOpenIds] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
      const newOpenIds = new Set(openIds);

      if (newOpenIds.has(id)) {
        newOpenIds.delete(id);
      } else {
        if (!allowMultiple) {
          newOpenIds.clear();
        }
        newOpenIds.add(id);
      }

      setOpenIds(newOpenIds);
    };

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            id={item.id}
            title={item.title}
            isOpen={openIds.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          >
            {item.children}
          </AccordionItem>
        ))}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

interface AccordionItemProps {
  id: string;
  title: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

const AccordionItem = ({
  id,
  title,
  isOpen = false,
  onToggle,
  children,
}: AccordionItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Measure content height when open state changes
  React.useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border border-rule rounded-card overflow-hidden">
      {/* Header Button */}
      <button
        id={id}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        className={cn(
          'w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4',
          'bg-white hover:bg-linho transition-colors duration-200',
          'font-sans font-medium text-left text-base md:text-lg text-noche',
          'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-naranja'
        )}
      >
        <span>{title}</span>
        <ChevronDown
          size={24}
          className={cn(
            'flex-shrink-0 text-naranja transition-transform duration-300 ease-in-out',
            isOpen ? 'rotate-180' : ''
          )}
          aria-hidden="true"
        />
      </button>

      {/* Content Container */}
      <div
        id={`accordion-content-${id}`}
        ref={contentRef}
        role="region"
        aria-labelledby={`${id}`}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        style={{ maxHeight: `${contentHeight}px` }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 bg-linho text-noche font-sans text-base md:text-lg leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

AccordionItem.displayName = 'AccordionItem';
