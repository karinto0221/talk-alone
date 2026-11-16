import { ChevronDown, FileText, Radio, Zap, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { PracticeMode } from '../type';

type Props = { value: PracticeMode; onChange: (mode: PracticeMode) => void };
type ModeOption = { id: PracticeMode; label: string; description: string; icon: LucideIcon };

const MODE_ORDER: readonly PracticeMode[] = ['speech', 'reflex', 'streamer'];

export function PracticeModeSelect({ value, onChange }: Props) {
  const { copy } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Partial<Record<PracticeMode, HTMLButtonElement | null>>>({});
  const options: readonly ModeOption[] = [
    { id: 'speech', label: copy.speechMode, description: copy.speechModeSub, icon: FileText },
    { id: 'reflex', label: copy.reflex, description: copy.reflexSub, icon: Zap },
    { id: 'streamer', label: copy.streamer, description: copy.streamerSub, icon: Radio },
  ];
  const selected = options.find((option) => option.id === value) ?? options[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    window.requestAnimationFrame(() => optionRefs.current[value]?.focus());
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, value]);

  const selectMode = (mode: PracticeMode) => {
    onChange(mode);
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const moveFocus = (currentMode: PracticeMode, direction: 1 | -1) => {
    const currentIndex = MODE_ORDER.indexOf(currentMode);
    const nextIndex = (currentIndex + direction + MODE_ORDER.length) % MODE_ORDER.length;
    optionRefs.current[MODE_ORDER[nextIndex]]?.focus();
  };

  return (
    <div className={`mode-select ${open ? 'open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="mode-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="practice-mode-list"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        <SelectedIcon size={17} />
        <span><b>{selected.label}</b><small>{selected.description}</small></span>
        <ChevronDown className="mode-select-chevron" size={16} />
      </button>
      {open && (
        <div className="mode-select-list" id="practice-mode-list" role="listbox" aria-label={copy.practiceMode}>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                ref={(element) => { optionRefs.current[option.id] = element; }}
                type="button"
                role="option"
                aria-selected={option.id === value}
                className={option.id === value ? 'mode-select-option selected' : 'mode-select-option'}
                onClick={() => selectMode(option.id)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    moveFocus(option.id, event.key === 'ArrowDown' ? 1 : -1);
                  }
                  if (event.key === 'Home' || event.key === 'End') {
                    event.preventDefault();
                    optionRefs.current[event.key === 'Home' ? MODE_ORDER[0] : MODE_ORDER[MODE_ORDER.length - 1]]?.focus();
                  }
                }}
              >
                <Icon size={17} />
                <span><b>{option.label}</b><small>{option.description}</small></span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
