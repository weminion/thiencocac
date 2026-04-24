// Chuông chùa bằng Web Audio API — hoạt động trên cả iOS Safari (AudioContext cần
// được tạo trong user-gesture handler, nên hàm này phải gọi từ onClick/onTap).
export function playBell(): void {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;

    const ctx = new AC();
    const now = ctx.currentTime;

    // G3, G4, D5 — 3 hoà âm tạo âm chuông trầm ấm
    const freqs = [196, 392, 587];
    const gains = [0.5, 0.3, 0.15];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gains[i], now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 4);
    });

    setTimeout(() => ctx.close(), 4500);
  } catch {
    // Silently ignore — audio không phải tính năng chính
  }
}
