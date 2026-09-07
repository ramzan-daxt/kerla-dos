const running = new WeakMap<Element, Animation>();

export function favoriteFeedback(button: HTMLElement, adding: boolean) {
  running.get(button)?.cancel();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || button.closest('.reduce-motion')) return;
  const frames = adding
    ? [
        { transform: 'scale(1)', boxShadow: '0 0 0 0 #ef638180' },
        { transform: 'scale(.88)', offset: .15 },
        { transform: 'scale(1.16)', boxShadow: '0 0 0 6px #ef638140', offset: .42 },
        { transform: 'scale(.97)', offset: .72 },
        { transform: 'scale(1)', boxShadow: '0 0 0 10px #ef638100' },
      ]
    : [{ transform: 'scale(1)' }, { transform: 'scale(.87)', offset: .4 }, { transform: 'scale(1)' }];
  running.set(button, button.animate(frames, { duration: adding ? 480 : 240, easing: 'ease-out' }));
}
