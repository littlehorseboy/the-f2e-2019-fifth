interface Container {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ContainReturnString = '' | 'left' | 'top' | 'right' | 'bottom';

export default function contain(sprite: PIXI.Sprite, container: Container): ContainReturnString {
  let collision: ContainReturnString = '';

  if (sprite.x < container.x) {
    sprite.position.set(container.x, sprite.y);
    collision = 'left';
  }

  if (sprite.y < container.y) {
    sprite.position.set(sprite.x, container.y);
    collision = 'top';
  }

  if (sprite.x + sprite.width > container.width) {
    sprite.position.set(container.width - sprite.width, sprite.y);
    collision = 'right';
  }

  if (sprite.y + sprite.height > container.height) {
    sprite.position.set(sprite.x, container.height - sprite.height);
    collision = 'bottom';
  }

  return collision;
}
