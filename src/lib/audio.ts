export enum Sounds {
  Collide,
  Strike,
  Hole,
}

export class AudioManager {
  sounds: Map<Sounds, HTMLAudioElement> = new Map();

  init() {
    this.sounds.set(Sounds.Collide, new Audio("sounds/BallsCollide.wav"));
    this.sounds.set(Sounds.Strike, new Audio("sounds/Strike.wav"));
    this.sounds.set(Sounds.Hole, new Audio("sounds/Hole.wav"));

    this.sounds.get(Sounds.Collide)?.load();
    this.sounds.get(Sounds.Strike)?.load();
    this.sounds.get(Sounds.Hole)?.load();
  }

  get(sound: Sounds) {
    return this.sounds.get(sound)?.cloneNode() as HTMLAudioElement;
  }

  play(sound: Sounds, volume = 1) {
    const _sound = this.get(sound);
    if (_sound) {
      _sound.volume = volume;
      _sound.play();
    }
  }
}
