// Σπρώχνει ένα event στο dataLayer του Google Tag Manager.
// Το GTM το «πιάνει» με Custom Event trigger (event name) και το στέλνει στο GA4.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushEvent(
  event: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
