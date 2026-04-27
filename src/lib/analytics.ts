declare global {
  interface Window {
    sa_event?: (name: string, metadata?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.sa_event?.(name, metadata);
}
