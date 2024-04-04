import { Ball } from "./ball";
import {
  BALL_RADIUS,
  FRICTION,
  HEIGHT,
  IMPUSLE_MULTIPLIER,
  PADDING,
  WIDTH,
} from "./consts";
import { clamp } from "./utils";
import { Vector } from "./vector";

export function physTick(deltaTime: number, balls: Ball[]) {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    ball.vel = ball.vel.add(ball.vel.multiply(-FRICTION * deltaTime));

    ball.pos = ball.pos.add(ball.vel.multiply(deltaTime));

    if (
      ball.pos.x - BALL_RADIUS < PADDING ||
      ball.pos.x + BALL_RADIUS > WIDTH - PADDING
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
  // Calculate the distance between the centers of the circles
  const distanceVector = ball2.pos.subtract(ball1.pos);
  const distance = distanceVector.length();

  // Check if the circles are colliding
  if (distance <= 2 * BALL_RADIUS) {
    // Calculate the penetration depth

    // Calculate the collision normal
    const collisionNormal = distanceVector.normalize();

    // Move circles away from each other to resolve the collision
    const moveVector = collisionNormal;
    ball1.pos = ball1.pos.subtract(moveVector);
    ball2.pos = ball2.pos.add(moveVector);

    // Calculate relative velocity
    const relativeVelocity = ball2.vel.subtract(ball1.vel);

    // Calculate impulse
    const impulse = relativeVelocity.dotProduct(collisionNormal);

    // Calculate adjusted velocities
    const velocityChange1 = collisionNormal.multiply(impulse);
    const velocityChange2 = collisionNormal.multiply(-impulse);
    // Update velocities
    ball1.vel = ball1.vel.add(velocityChange1);
    ball2.vel = ball2.vel.add(velocityChange2);
  }
}

export function applyImpulse(ball: Ball, impusle: Vector) {
  ball.vel = ball.vel.add(impusle.multiply(IMPUSLE_MULTIPLIER));
}
