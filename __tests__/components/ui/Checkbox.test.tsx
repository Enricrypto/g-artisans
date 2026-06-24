import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@/components/ui/Checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox with label', () => {
    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('I accept the privacy policy');

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'privacy');
  });

  it('renders with JSX label content', () => {
    render(
      <Checkbox
        id="terms"
        label={
          <span>
            I agree to the <a href="/terms">Terms of Service</a>
          </span>
        }
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const link = screen.getByRole('link', { name: /terms of service/i });

    expect(checkbox).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    const { container } = render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
        required
      />
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass("after:content-['*']");
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();

    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
      />
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('displays error message and applies error styling', () => {
    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
        error="You must accept the privacy policy"
      />
    );

    const errorText = screen.getByText('You must accept the privacy policy');
    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveAttribute('role', 'alert');

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby', 'privacy-description');
  });

  it('does not show aria-describedby when no error or helper', () => {
    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toHaveAttribute('aria-describedby');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
        disabled
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('can be focused', async () => {
    const user = userEvent.setup();

    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.tab();

    expect(checkbox).toHaveFocus();
  });

  it('is marked as invalid when required and not checked', () => {
    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
        required
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.required).toBe(true);
    expect(checkbox.checked).toBe(false);
  });

  it('handles change event', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
  });

  it('labels apply correct error styling', () => {
    const { container } = render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
        error="Error message"
      />
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass('text-naranja');
  });

  it('labels apply normal styling when no error', () => {
    const { container } = render(
      <Checkbox
        id="privacy"
        label="I accept the privacy policy"
      />
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass('text-noche');
  });
});
