import { AudioManager, Sounds } from "./audio";
import { Ball } from "./ball";
import {
  BALL_RADIUS,
  FRICTION,
  HEIGHT,
  HOLE_SIDE,
  IMPULSE_VECTOR_OFFSET,
  IMPUSLE_MULTIPLIER,
  MAX_IMPULSE,
  PADDING,
  WIDTH,
} from "./consts";
import { clamp, clampVectorByLength } from "./utils";
import { Vector } from "./vector";

export function physTick(deltaTime: number, balls: Ball[]) {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    ball.vel = ball.vel.add(ball.vel.multiply(-FRICTION * deltaTime));

    ball.pos = ball.pos.add(ball.vel.multiply(deltaTime));

    if (
      (ball.pos.x - BALL_RADIUS < PADDING ||
        ball.pos.x + BALL_RADIUS > WIDTH - PADDING) &&
      !(
        ball.pos.y - BALL_RADIUS > PADDING + HEIGHT / 2 - HOLE_SIDE / 2 &&
        ball.pos.y + BALL_RADIUS < PADDING + HEIGHT / 2 + HOLE_SIDE / 2
      )
    ) {
      ball.vel.x *= -1;
      ball.pos.x = clamp(
        ball.pos.x,
        PADDING + BALL_RADIUS,
        WIDTH - PADDING - BALL_RADIUS
      );
    }

    if (
      ball.pos.y - BALL_RADIUS < PADDING ||
      ball.pos.y + BALL_RADIUS > HEIGHT - PADDING
    ) {
      ball.vel.y *= -1;
      ball.pos.y = clamp(
        ball.pos.y,
        PADDING + BALL_RADIUS,
        HEIGHT - PADDING - BALL_RADIUS
      );
    }

    for (let j = 0; j < balls.length; j++) {
      if (i === j) continue;

      resolveBallCollision(ball, balls[j]);
    }
  }
}

function resolveBallCollision(ball1: Ball, ball2: Ball): void {
  const distanceVector = ball2.pos.subtract(ball1.pos);
  const distance = distanceVector.length();

  if (distance <= 2 * BALL_RADIUS) {
    const collisionNormal = distanceVector.normalize();
    const moveVector = collisionNormal;

    ball1.pos = ball1.pos.subtract(moveVector);
    ball2.pos = ball2.pos.add(moveVector);

    const relativeVelocity = ball2.vel.subtract(ball1.vel);

    const impulse = relativeVelocity.dotProduct(collisionNormal);

    const velocityChange1 = collisionNormal.multiply(impulse);
    const velocityChange2 = collisionNormal.multiply(-impulse);

    ball1.vel = ball1.vel.add(velocityChange1);
    ball2.vel = ball2.vel.add(velocityChange2);

    const volume = clamp(
      Math.abs(impulse) / (MAX_IMPULSE * IMPUSLE_MULTIPLIER),
      0,
      1
    );

    AudioManager.play(Sounds.Collide, volume);
  }
}

export function applyImpulse(ball: Ball, impusle: Vector) {
  if (impusle.length() < IMPULSE_VECTOR_OFFSET) return;

  const clampedVel = clampVectorByLength(impusle, 0, MAX_IMPULSE);

  const lengthWithOffset = clampedVel.length() - IMPULSE_VECTOR_OFFSET;

  ball.vel = ball.vel.add(
    clampedVel.normalize().multiply(lengthWithOffset * IMPUSLE_MULTIPLIER)
  );
}

// export function raycast(origin: Vector, direction: Vector, balls: Ball[]) {

// }
