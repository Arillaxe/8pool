import { Ball } from "./ball";
import { WIDTH, HEIGHT, OUTLINE_COLOR, BALL_RADIUS } from "./consts";
import { applyImpulse, physTick } from "./phys";
import { Renderer } from "./renderer";
import { randomIntInRange, shuffleArray } from "./utils";
import { Vector } from "./vector";

export class Game {
  private renderer: Renderer;
  private lastTime = Date.now();
  private isRunning = false;

  private balls: Ball[] = [];
  private impulseStartVector: Vector | null = null;
  private impulseEndVector: Vector | null = null;
  private mouseDown = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas.getContext("2d")!);

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const colors = [
      "magenta",
      "lime",
      "yellow",
      "red",
      "orange",
      "blue",
      "cyan",
    ];

    this.balls.push(
      new Ball(
        new Vector(300, 700),
        new Vector(randomIntInRange(0, 0), randomIntInRange(0, 0)),
        OUTLINE_COLOR,
        true
      )
    );

    const solidBalls = shuffleArray(
      Array(7).fill(true).concat(Array(7).fill(false))
    );

    let row = 0;
    let offset = 0;
    let col = 0;
    for (let i = 0; i < 15; i++) {
      const solid = i === 10 ? true : solidBalls.pop();

      if (row === 0 && i === 5) {
        offset += 0.5;
        row++;
        col = 0;
      }
      if (row === 1 && i === 9) {
        offset += 0.5;
        row++;
        col = 0;
      }
      if (row === 2 && i === 12) {
        offset += 0.5;
        row++;
        col = 0;
      }
      if (row === 3 && i === 14) {
        offset += 0.5;
        row++;
        col = 0;
      }

      const pos = new Vector(250, 100);
      pos.x += BALL_RADIUS * 2 * offset + col * (BALL_RADIUS * 2);
      pos.y += row * (BALL_RADIUS * 2);

      col++;

      this.balls.push(
        new Ball(
          pos,
          new Vector(0, 0),
          i === 10 ? "black" : colors[randomIntInRange(0, colors.length - 1)],
          solid
        )
      );
    }
  }

  private tick() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    physTick(deltaTime, this.balls);

    this.renderer.render(this.balls);

    if (this.mouseDown && this.impulseStartVector && this.impulseEndVector) {
      this.renderer.renderImpulseGizmo(
        this.balls[0].pos,
        this.impulseStartVector,
        this.impulseEndVector
      );
    }

    if (this.isRunning) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }

  init() {
    this.isRunning = true;

    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  mouseStartCallback(x: number, y: number) {
    this.mouseDown = true;
    this.impulseStartVector = new Vector(x, y);
  }

  mouseMoveCallback(x: number, y: number) {
    if (this.mouseDown) {
      this.impulseEndVector = new Vector(x, y);
    }
  }

  mouseEndCallback(x: number, y: number) {
    this.mouseDown = false;
    applyImpulse(
      this.balls[0],
      this.impulseStartVector!.subtract(new Vector(x, y))
    );

    this.impulseStartVector = null;
    this.impulseEndVector = null;
  }
}
