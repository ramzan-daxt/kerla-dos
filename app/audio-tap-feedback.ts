// A brief acknowledgement of a tap, not an indicator that audio has loaded.
const feedback = new WeakMap<Element, Animation>();
export function audioTapFeedback(target: Element) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || target.closest('.reduce-motion')) return;
  const card = target.closest('.big-card, .random-card');
  if (!card) return;
  const icon = card.querySelector('.play .app-icon, .random-sound .app-icon, .random-audio .app-icon');
  const pulse = (element: Element, frames: Keyframe[]) => {
    feedback.get(element)?.cancel();
    feedback.set(element, element.animate(frames, { duration: 420, easing: 'ease-out' }));
  };
  // Inset highlight does not move the card or interfere with its swipe transform.
  pulse(card, [{ boxShadow: 'inset 0 0 0 3px #55a18800' }, { boxShadow: 'inset 0 0 0 3px #55a18880', offset: .3 }, { boxShadow: 'inset 0 0 0 3px #55a18800' }]);
  if (icon) pulse(icon, [{ transform: 'scale(1)' }, { transform: 'scale(1.2)', offset: .3 }, { transform: 'scale(1)' }]);
}
