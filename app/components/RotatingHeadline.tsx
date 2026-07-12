'use client';

import { useEffect, useState } from 'react';

// Σύντομες φράσεις που εναλλάσσονται στον τίτλο.
const PHRASES = [
  'Θεατρικά Έργα',
  'Παιδικές Ιστορίες',
  'Παραμύθια',
  'Αφηγήσεις',
  'Μυθιστορήματα',
];

export default function RotatingHeadline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    // Σεβασμός στην προτίμηση μειωμένης κίνησης — μένει σταθερό.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % PHRASES.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      key={i}
      className="text-gold inline-block animate-word-in"
      aria-live="polite"
    >
      {PHRASES[i]}
    </span>
  );
}
