/**
 * Clipboard helpers with a fallback for environments where the async
 * Clipboard API is unavailable or permission is denied.
 *
 * Returns `true` only when the text was actually placed on the clipboard —
 * callers must not show a success state on `false`.
 */

export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;

  // Preferred path: async Clipboard API (requires a secure context).
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }

  // Fallback: hidden textarea + execCommand (older browsers / iframes).
  try {
    if (typeof document === 'undefined') return false;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const succeeded = document.execCommand('copy');
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}
