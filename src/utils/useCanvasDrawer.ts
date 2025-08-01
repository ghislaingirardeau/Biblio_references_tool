import type { Ref } from 'vue';

interface rect {
  x: number;
  y: number;
  width: number;
  height: number;
  lineWidth: number;
}

export function drawVideoToCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  videoRef: Ref<HTMLVideoElement | null>,
  ctx: Ref<CanvasRenderingContext2D | null>,
  rect: Ref<rect>,
  squareSize: number,
) {
  const canvas = canvasRef.value;
  const video = videoRef.value;
  if (canvas && video) {
    ctx.value = canvas.getContext('2d')!;
    ctx.value.clearRect(0, 0, canvas.width, canvas.height);
    ctx.value.drawImage(video, 0, 0, canvas.width, canvas.height);

    drawRect(ctx, rect, squareSize);
  }
  //   requestAnimationFrame(drawVideoToCanvas);
}

export function drawRect(
  ctx: Ref<CanvasRenderingContext2D | null>,
  rect: Ref<rect>,
  squareSize: number,
) {
  if (!ctx.value) return;
  drawRectCorners(ctx, rect.value.x, rect.value.y, rect.value.width, rect.value.height);
  drawRectCorners(
    ctx,
    rect.value.x + rect.value.width - squareSize,
    rect.value.y + rect.value.height - squareSize,
    squareSize,
    squareSize,
    10,
    true,
  );

  drawResizeIcon(
    rect.value.x + rect.value.width - squareSize + 35,
    rect.value.y + rect.value.height - squareSize + 35,
    40,
    ctx,
  );
}

export function drawResizeIcon(
  x: number,
  y: number,
  size = 40,
  ctx: Ref<CanvasRenderingContext2D | null>,
) {
  if (!ctx.value) return;
  ctx.value.save();
  ctx.value.strokeStyle = '#1976d2';
  ctx.value.lineWidth = 2;
  ctx.value.translate(x, y); // Position the icon
  ctx.value.rotate(Math.PI / 4); // Rotate 45 degrees to make it diagonal

  // Draw the line
  ctx.value.beginPath();
  ctx.value.moveTo(-size / 2, 0);
  ctx.value.lineTo(size / 2, 0);
  ctx.value.stroke();

  // Left arrowhead
  ctx.value.beginPath();
  ctx.value.moveTo(-size / 2 + 4, -4);
  ctx.value.lineTo(-size / 2, 0);
  ctx.value.lineTo(-size / 2 + 4, 4);
  ctx.value.stroke();

  // Right arrowhead
  ctx.value.beginPath();
  ctx.value.moveTo(size / 2 - 4, -4);
  ctx.value.lineTo(size / 2, 0);
  ctx.value.lineTo(size / 2 - 4, 4);
  ctx.value.stroke();

  ctx.value.restore();
}

function drawRectCorners(
  ctx: Ref<CanvasRenderingContext2D | null>,
  x: number,
  y: number,
  width: number,
  height: number,
  cornerLength = 35,
  drawBottomRight = false,
  color = '#1976d2',
  lineWidth = 4,
) {
  if (!ctx.value) return;

  ctx.value.strokeStyle = color;
  ctx.value.lineWidth = lineWidth;

  // Top-left corner
  ctx.value.beginPath();
  ctx.value.moveTo(x, y + cornerLength);
  ctx.value.lineTo(x, y);
  ctx.value.lineTo(x + cornerLength, y);
  ctx.value.stroke();

  // Top
  ctx.value.beginPath();
  ctx.value.moveTo(x + width / 2, y);
  ctx.value.lineTo(x + width / 2 + cornerLength, y);
  ctx.value.lineTo(x + width / 2 - cornerLength, y);
  ctx.value.stroke();

  // right
  ctx.value.beginPath();
  ctx.value.moveTo(x + width, y + height / 2);
  ctx.value.lineTo(x + width, y + height / 2 + cornerLength);
  ctx.value.lineTo(x + width, y + height / 2 - cornerLength);
  ctx.value.stroke();

  // left
  ctx.value.beginPath();
  ctx.value.moveTo(x, y + height / 2);
  ctx.value.lineTo(x, y + height / 2 + cornerLength);
  ctx.value.lineTo(x, y + height / 2 - cornerLength);
  ctx.value.stroke();

  // Bottom
  ctx.value.beginPath();
  ctx.value.moveTo(x + width / 2, y + height);
  ctx.value.lineTo(x + width / 2 + cornerLength, y + height);
  ctx.value.lineTo(x + width / 2 - cornerLength, y + height);
  ctx.value.stroke();

  // Top-right corner
  ctx.value.beginPath();
  ctx.value.moveTo(x + width - cornerLength, y);
  ctx.value.lineTo(x + width, y);
  ctx.value.lineTo(x + width, y + cornerLength);
  ctx.value.stroke();

  // Bottom-left corner
  ctx.value.beginPath();
  ctx.value.moveTo(x + cornerLength, y + height);
  ctx.value.lineTo(x, y + height);
  ctx.value.lineTo(x, y + height - cornerLength);
  ctx.value.stroke();

  if (drawBottomRight) {
    // Bottom-right corner
    ctx.value.beginPath();
    ctx.value.moveTo(x + width, y + height - cornerLength);
    ctx.value.lineTo(x + width, y + height);
    ctx.value.lineTo(x + width - cornerLength, y + height);
    ctx.value.stroke();
  }
}
