export function renderFrame(
  canvas: HTMLCanvasElement,
  frameImage: HTMLImageElement
): void {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;

  ctx.drawImage(frameImage, 0, 0, w, h);
}
