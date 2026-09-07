// A small, component-owned cache. Preloading never starts playback.
export function createAudioPool() {
  const clips = new Map();
  function get(src) {
    if (clips.has(src)) return clips.get(src);
    const clip = new Audio();
    clip.preload = 'auto';
    clip.src = src;
    clips.set(src, clip);
    clip.load();
    return clip;
  }
  function release(clip) {
    clip.pause();
    clip.removeAttribute('src');
    clip.load();
  }
  return {
    get,
    prepare(sources) {
      const wanted = new Set(sources.filter(Boolean));
      for (const [src, clip] of clips) {
        if (!wanted.has(src)) { release(clip); clips.delete(src); }
      }
      for (const src of wanted) get(src);
    },
    clear() { for (const clip of clips.values()) release(clip); clips.clear(); },
  };
}
