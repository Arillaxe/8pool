export enum Sprites {
  Cue,
}

class _SpriteManager {
  sprites: Map<Sprites, HTMLImageElement> = new Map();

  init() {
    const sprite = new Image();
    sprite.src = "sprites/cue.png";
    this.sprites.set(Sprites.Cue, sprite);
  }

  get(sprite: Sprites) {
    return this.sprites.get(sprite);
  }
}

export const SpriteManager = new _SpriteManager();
