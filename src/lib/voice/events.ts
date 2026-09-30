/** Fired by any "talk to Basil" button; the voice orb listens and opens. */
export const OPEN_GUIDE_EVENT = 'voice-guide:open';

export function openGuide() {
  window.dispatchEvent(new Event(OPEN_GUIDE_EVENT));
}
