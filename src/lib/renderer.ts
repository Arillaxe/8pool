import { Ball } from "./ball";
import {
  BALL_RADIUS,
  CUE_BALL_OFFSET,
  CUE_LENGTH,
  HEIGHT,
  HOLE_CORNER,
  HOLE_SIDE,
  IMPULSE_VECTOR_OFFSET,
  MAX_IMPULSE,
  OUTLINE_COLOR,
  PADDING,
  WIDTH,
} from "./consts";
import { clamp } from "./utils";
import { Vector } from "./vector";

export class Renderer {
  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  private clear() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  private drawTable() {
    this.ctx.strokeStyle = OUTLINE_COLOR;
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();

    this.ctx.moveTo(PADDING, PADDING + HOLE_CORNER);
    this.ctx.lineTo(PADDING, PADDING + HEIGHT / 2 - HOLE_SIDE / 2);

    this.ctx.moveTo(PADDING, PADDING + HEIGHT / 2 + HOLE_SIDE / 2);
    this.ctx.lineTo(PADDING, HEIGHT - PADDING - HOLE_CORNER);

    this.ctx.moveTo(PADDING + HOLE_CORNER, HEIGHT - PADDING);
    this.ctx.lineTo(WIDTH - PADDING - HOLE_CORNER, HEIGHT - PADDING);

    this.ctx.moveTo(WIDTH - PADDING, HEIGHT - PADDING - HOLE_CORNER);
    this.ctx.lineTo(WIDTH - PADDING, PADDING + HEIGHT / 2 + HOLE_SIDE / 2);

    this.ctx.moveTo(WIDTH - PADDING, PADDING + HEIGHT / 2 - HOLE_SIDE / 2);
    this.ctx.lineTo(WIDTH - PADDING, PADDING + HOLE_CORNER);

    this.ctx.moveTo(PADDING + HOLE_CORNER, PADDING);
    this.ctx.lineTo(WIDTH - PADDING - HOLE_CORNER, PADDING);

    this.ctx.stroke();
  }

  private drawBalls(balls: Ball[]) {
    for (const ball of balls) {
      this.ctx.fillStyle = ball.color;
      this.ctx.beginPath();
      this.ctx.arc(ball.pos.x, ball.pos.y, BALL_RADIUS, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  render(balls: Ball[]) {
    this.ctx.save();

    this.clear();
    this.drawTable();
    this.drawBalls(balls);

    this.ctx.restore();
  }

  renderImpulseGizmo(origin: Vector, startVector: Vector, endVector: Vector) {
    const impulseVector = endVector.subtract(startVector);
    const impulseVectorLength = impulseVector.length();

    const startPos = clamp(
      impulseVectorLength - IMPULSE_VECTOR_OFFSET + CUE_BALL_OFFSET,
      CUE_BALL_OFFSET,
      MAX_IMPULSE + CUE_BALL_OFFSET
    );

    const cueStart = origin.add(impulseVector.normalize().multiply(startPos));
    const cueEnd = origin.add(
      impulseVector.normalize().multiply(startPos + CUE_LENGTH)
    );

    this.ctx.beginPath();
    this.ctx.moveTo(cueStart.x, cueStart.y);
    this.ctx.lineTo(cueEnd.x, cueEnd.y);
    this.ctx.strokeStyle =
      impulseVectorLength < IMPULSE_VECTOR_OFFSET ? "lime" : OUTLINE_COLOR;
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(
      startVector.x,
      startVector.y,
      Math.min(impulseVector.length(), MAX_IMPULSE + IMPULSE_VECTOR_OFFSET),
      0,
      2 * Math.PI
    );
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
}
