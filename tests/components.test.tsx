// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { PasswordDisplay } from '../src/components/generator/PasswordDisplay';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function mockClipboardSuccess() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(window.navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  });
  return writeText;
}

describe('PasswordDisplay', () => {
  it('shows "Copied!" after a successful copy and announces it to assistive tech', async () => {
    const writeText = mockClipboardSuccess();
    render(<PasswordDisplay password="s3cret-value" onRegenerate={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /copy password/i }));
    expect(writeText).toHaveBeenCalledWith('s3cret-value');

    await waitFor(() => expect(screen.getByRole('button', { name: /copied!/i })).toBeTruthy());
    // The <output> element also carries an implicit "status" role, so target
    // the dedicated screen-reader announcement by its text.
    expect(screen.getByText('Password copied to clipboard.')).toBeTruthy();
  });

  it('shows a clear error (and no success state) when the clipboard is unavailable', async () => {
    Object.defineProperty(window.navigator, 'clipboard', { value: undefined, configurable: true, writable: true });
    render(<PasswordDisplay password="s3cret-value" onRegenerate={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /copy password/i }));

    await waitFor(() =>
      expect(screen.getByText(/could not access the clipboard/i)).toBeTruthy()
    );
    expect(screen.queryByRole('button', { name: /copied!/i })).toBeNull();
  });

  it('calls onRegenerate when the regenerate button is pressed', () => {
    const onRegenerate = vi.fn();
    render(<PasswordDisplay password="s3cret-value" onRegenerate={onRegenerate} />);
    fireEvent.click(screen.getByRole('button', { name: /generate a new password/i }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility with an accessible pressed state', () => {
    render(<PasswordDisplay password="s3cret-value" onRegenerate={() => {}} />);
    const toggle = screen.getByRole('button', { name: /hide password/i });
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(toggle);
    const shown = screen.getByRole('button', { name: /show password/i });
    expect(shown.getAttribute('aria-pressed')).toBe('false');
  });

  it('disables copy and regenerate while disabled', () => {
    render(<PasswordDisplay password="s3cret-value" onRegenerate={() => {}} disabled />);
    expect(screen.getByRole('button', { name: /copy password/i }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: /generate a new password/i }).hasAttribute('disabled')).toBe(true);
  });
});
