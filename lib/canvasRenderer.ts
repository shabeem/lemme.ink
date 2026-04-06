export function renderFrame(
  canvas: HTMLCanvasElement,
  frameImage: HTMLImageElement
): void {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const canvasW = canvas.width;
  const canvasH = canvas.height;

  const imgW = frameImage.width;
  const imgH = frameImage.height;

  // Calculate scaling to cover entire canvas (like CSS background-size: cover)
  const canvasAspect = canvasW / canvasH;
  const imgAspect = imgW / imgH;

  let drawW: number, drawH: number, drawX: number, drawY: number;

  if (imgAspect > canvasAspect) {
    // Image is wider, fit to height
    drawH = canvasH;
    drawW = (imgW / imgH) * canvasH;
    drawX = (canvasW - drawW) / 2;
    drawY = 0;
  } else {
    // Image is taller, fit to width
    drawW = canvasW;
    drawH = (imgH / imgW) * canvasW;
    drawX = 0;
    drawY = (canvasH - drawH) / 2;
  }

  ctx.fillStyle = '#111010';
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.drawImage(frameImage, drawX, drawY, drawW, drawH);
}
