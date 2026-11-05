import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react';

/** a modal <dialog> driven by `open`: Esc and a tap on the dimmed backdrop both ask to close */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return {
    ref,
    onCancel: (e: SyntheticEvent) => { e.preventDefault(); onClose(); },
    onClick: (e: MouseEvent) => { if (e.target === ref.current) onClose(); },
  };
}
