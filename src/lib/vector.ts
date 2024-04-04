export class Vector {
  constructor(public x: number, public y: number) {}

  add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector {
    if (scalar === 0) {
      throw new Error("Cannot divide by zero");
    }
    return new Vector(this.x / scalar, this.y / scalar);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector {
    const len = this.length();
    if (len === 0) {
      return new Vector(0, 0);
    }
    return new Vector(this.x / len, this.y / len);
  }

  dotProduct(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  angleBetween(vector: Vector): number {
    const dotProduct = this.dotProduct(vector);
    const lenProduct = this.length() * vector.length();
    if (lenProduct === 0) {
      return 0; // undefined, vectors are orthogonal
    }
    return Math.acos(Math.max(-1, Math.min(1, dotProduct / lenProduct)));
  }
}
