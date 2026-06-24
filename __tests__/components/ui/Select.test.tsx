import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/ui/Select';

describe('Select Component', () => {
  const defaultOptions = [
    { value: 'moda', label: 'Moda' },
    { value: 'cuero', label: 'Cuero' },
    { value: 'ceramica', label: 'Cerámica' },
  ];

  it('renders select with label', () => {
    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
      />
    );

    const label = screen.getByText('Category');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'category');
  });

  it('renders all options', () => {
    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
      />
    );

    const select = screen.getByRole('combobox', { name: /category/i });
    const options = select.querySelectorAll('option');

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('moda');
    expect(options[1]).toHaveValue('cuero');
    expect(options[2]).toHaveValue('ceramica');
  });

  it('renders placeholder option when provided', () => {
    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
        placeholder="Select a category"
      />
    );

    const select = screen.getByRole('combobox', { name: /category/i });
    const placeholderOption = select.querySelector('option[value=""]');

    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toHaveTextContent('Select a category');
  });

  it('shows required indicator when required', () => {
    const { container } = render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
        required
      />
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass("after:content-['*']");
  });

  it('displays error message and applies error styling', () => {
    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
        error="Category is required"
      />
    );

    const errorText = screen.getByText('Category is required');
    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveAttribute('role', 'alert');

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', 'category-description');
  });

  it('displays helper text when no error', () => {
    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
        helperText="Select your craft category"
      />
    );

    const helperText = screen.getByText('Select your craft category');
    expect(helperText).toBeInTheDocument();
    expect(helperText).not.toHaveAttribute('role', 'alert');
  });

  it('handles value change', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'ceramica');

    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue('ceramica');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
        disabled
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('focuses select on label click', async () => {
    const user = userEvent.setup();

    render(
      <Select
        id="category"
        label="Category"
        options={defaultOptions}
      />
    );

    const label = screen.getByText('Category');
    await user.click(label);

    const select = screen.getByRole('combobox');
    expect(select).toHaveFocus();
  });
});
