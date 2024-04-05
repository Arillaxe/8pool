import { Vector } from "./vector";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomIntInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mapNToY(n: number) {
  if (n < 5) {
    return 0;
  } else if (n < 9) {
    return 1;
  } else if (n < 12) {
    return 2;
  } else if (n < 14) {
    return 3;
  } else {
    return 4;
  }
}

export function mapNToX(n: number) {
  if (n < 5) {
    return 0;
  } else if (n < 9) {
    return 0.5;
  } else if (n < 12) {
    return 1;
  } else if (n < 14) {
    return 1.5;
  } else {
    return 2;
  }
}

export function shuffleArray<T>(array: T[]) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export function clampVectorByLength(vector: Vector, min: number, max: number) {
  const length = vector.length();
  const clampedLength = clamp(length, min, max);
  const scaleFactor = clampedLength / length;

  return new Vector(vector.x * scaleFactor, vector.y * scaleFactor);
}
