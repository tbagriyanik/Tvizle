// Guards global keyboard shortcuts from firing while the user is typing in a
// text field (e.g. the search box). Shortcut keys must never conflict with
// normal character input.
export const isEditableTarget = (e: KeyboardEvent | null): boolean => {
  const el = (e?.target ?? document.activeElement) as HTMLElement | null;
  if (!el) return false;
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  ) {
    return true;
  }
  if (el.isContentEditable) return true;
  return false;
};
