import { calcTileType } from '../utils';

test('Upper left corner should be rendered', () => {
  const upperLeftCorner = calcTileType(0, 64);
  expect(upperLeftCorner).toBe('top-left');
});

test('Top side should be rendered', () => {
  const topSide = calcTileType(5, 64);
  expect(topSide).toBe('top');
});

test('Upper right corner should be rendered', () => {
  const upperRightCorner = calcTileType(7, 64);
  expect(upperRightCorner).toBe('top-right');
});

test('Left side should be rendered', () => {
  const leftSide = calcTileType(8, 64);
  expect(leftSide).toBe('left');
});

test('Center should be rendered', () => {
  const center = calcTileType(35, 64);
  expect(center).toBe('center');
});

test('Right side should be rendered', () => {
  const rightSide = calcTileType(15, 64);
  expect(rightSide).toBe('right');
});

test('Bottom left corner should be rendered', () => {
  const lowerLeftCorner = calcTileType(56, 64);
  expect(lowerLeftCorner).toBe('bottom-left');
});

test('Bottom side should be rendered', () => {
  const bottomSide = calcTileType(60, 64);
  expect(bottomSide).toBe('bottom');
});

test('Bottom right corner should be rendered', () => {
  const lowerRightCorner = calcTileType(63, 64);
  expect(lowerRightCorner).toBe('bottom-right');
});
