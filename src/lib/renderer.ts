import { Ball } from "./ball";
import {
  BALL_RADIUS,
  HEIGHT,
  IMPULSE_VECTOR_OFFSET,
  OUTLINE_COLOR,
  PADDING,
  WIDTH,
} from "./consts";
import { Vector } from "./vector";

export class Renderer {
  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  private clear() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  private drawTable() {
    this.ctx.strokeStyle = OUTLINE_COLOR;
    this.ctx.strokeRect(
      PADDING,
      PADDING,
      WIDTH - 2 * PADDING,
      HEIGHT - 2 * PADDING
    );
  }

  private drawBalls(balls: Ball[]) {
    for (const ball of balls) {
      this.ctx.fillStyle = ball.color;
      this.ctx.beginPath();
      this.ctx.arc(ball.pos.x, ball.pos.y, BALL_RADIUS, 0, 2 * Math.PI);
      this.ctx.fill();

      if (!ball.solid) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(
          ball.pos.x,
          ball.pos.y,
          (BALL_RADIUS / 4) * 2.5,
          0,
          2 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.ctx.restore();
      }
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
    const impulseVector = startVector.subtract(endVector);
    const targetVector = origin.add(impulseVector);

    const impulseVectorLength = impulseVector.length();

    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(targetVector.x, targetVector.y);
    this.ctx.strokeStyle =
      impulseVectorLength < IMPULSE_VECTOR_OFFSET ? "lime" : OUTLINE_COLOR;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(
      startVector.x,
      startVector.y,
      impulseVector.length(),
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
  }
}
