import { Vector } from "./vector";

export class Ball {
  constructor(
    public pos: Vector,
    public vel: Vector,
    public color: string,
    public solid: boolean
  ) {}
}
