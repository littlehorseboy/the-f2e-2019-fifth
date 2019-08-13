export default function hitTestRectangle(
  r1: PIXI.Sprite | PIXI.Graphics,
  r2: PIXI.Sprite | PIXI.Graphics,
): boolean {
  // hit will determine whether there's a collision
  let hit: boolean;

  // Find the center points of each sprite
  const r1CenterX = r1.x + r1.width / 2;
  const r1CenterY = r1.y + r1.height / 2;
  const r2CenterX = r2.x + r2.width / 2;
  const r2CenterY = r2.y + r2.height / 2;

  // Find the half-widths and half-heights of each sprite
  const r1HalfWidth = r1.width / 2;
  const r1HalfHeight = r1.height / 2;
  const r2HalfWidth = r2.width / 2;
  const r2HalfHeight = r2.height / 2;

  // Calculate the distance vector between the sprites
  const vx = r1CenterX - r2CenterX;
  const vy = r1CenterY - r2CenterY;

  // Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1HalfWidth + r2HalfWidth;
  const combinedHalfHeights = r1HalfHeight + r2HalfHeight;

  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    // A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      hit = true;
    } else {
      // There's no collision on the y axis
      hit = false;
    }
  } else {
    // There's no collision on the x axis
    hit = false;
  }

  // hit will be either `true` or `false`
  return hit;
}
