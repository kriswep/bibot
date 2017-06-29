/* globals test expect jest document */
import WTGM from './wtgm';

test('WTGM should have its methods', () => {
  expect(WTGM).toBeDefined();
  expect(WTGM.init).toBeDefined();
  expect(WTGM.resize).toBeDefined();
  expect(WTGM.translatePixels).toBeDefined();
  expect(WTGM.handleTouch).toBeDefined();
  expect(WTGM.handleTouchEnd).toBeDefined();
  expect(WTGM.startGame).toBeDefined();
  expect(WTGM.endGame).toBeDefined();
  expect(WTGM.update).toBeDefined();
  expect(WTGM.render).toBeDefined();
  expect(WTGM.loop).toBeDefined();
});

test('WTGM should be initialisable', () => {
  jest.useFakeTimers();
  const cvs = document.createElement('canvas');
  document.body.appendChild(cvs);
  function preloadResources(canvas, callback) {
    callback();
  }
  expect(WTGM.init.bind(null, preloadResources)).not.toThrow();
  expect(WTGM.startGame).not.toThrow();

  jest.runTimersToTime(10);
  jest.useRealTimers();
});

// pixels should be translated to canvas
test('WTGM should be able to translate Pixels', () => {
  expect(WTGM.translatePixels(10, 20)).toEqual({ x: 6.25, y: 12.5 });
  expect(WTGM.translatePixels(50, 60)).toEqual({ x: 31.25, y: 37.5 });
});
// touch handling
test('WTGM should handle touch', () => {
  expect(WTGM.handleTouch.bind(WTGM, 10, 20)).not.toThrow();
  expect(WTGM.touchX).toBe(6.25);
  expect(WTGM.touchY).toBe(12.5);

  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  // convice WTGM it is touched, but end touch directly
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  WTGM.paused = false;
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.touching).toBeFalsy();
});

// update
test('WTGM should update its objects', () => {
  WTGM.objects = [];
  // update should end Game
  WTGM.paused = 0;
  WTGM.life = 0;
  expect(WTGM.update.bind(WTGM)).not.toThrow();

  // add mocked objects
  WTGM.objects = [];
  WTGM.objects.push({
    update: jest.fn(),
    remove: false,
  });
  WTGM.objects.push({
    update: jest.fn(),
    remove: true,
  });
  WTGM.life = 1;
  expect(WTGM.update.bind(WTGM)).not.toThrow();

  // should have called objects update
  expect(WTGM.objects[0].update.mock.calls.length).toBe(1);
  // should have removed objects to remove
  expect(WTGM.objects.length).toBe(1);
});

// render
test('WTGM should render to canvas', () => {
  // mock ctx
  WTGM.ctx = jest.fn();
  WTGM.ctx.clearRect = jest.fn();
  WTGM.ctx.fillRect = jest.fn();
  WTGM.ctx.drawImage = jest.fn();
  WTGM.ctx.fillText = jest.fn();
  // add mocked objects
  WTGM.objects = [];
  WTGM.objects.push({
    draw: jest.fn(),
  });
  expect(WTGM.render.bind(WTGM)).not.toThrow();

  expect(WTGM.ctx.clearRect.mock.calls[0]).toEqual([
    0,
    0,
    WTGM.WIDTH,
    WTGM.HEIGHT,
  ]);
  expect(WTGM.ctx.fillRect.mock.calls[0]).toEqual([
    0,
    0,
    WTGM.WIDTH,
    WTGM.HEIGHT,
  ]);

  expect(WTGM.objects[0].draw.mock.calls.length).toBe(1);

  WTGM.ctx.clearRect.mockClear();
  WTGM.ctx.fillRect.mockClear();
  WTGM.ctx.drawImage.mockClear();
  WTGM.ctx.fillText.mockClear();

  // draw fps should not throw
  WTGM.showFps = 1;
  expect(WTGM.render.bind(WTGM)).not.toThrow();

  WTGM.ctx.clearRect.mockClear();
  WTGM.ctx.fillRect.mockClear();
  WTGM.ctx.drawImage.mockClear();
  WTGM.ctx.fillText.mockClear();
});

// loop
test('WTGM should have a loop function', () => {
  WTGM.ctx = jest.fn();
  WTGM.ctx.clearRect = jest.fn();
  WTGM.ctx.fillRect = jest.fn();
  WTGM.ctx.fillText = jest.fn();
  WTGM.objects = [];
  WTGM.paused = 0;
  WTGM.showFps = 1;
  // loop should call update and render,
  // which we already tested
  expect(WTGM.loop.bind(WTGM)).not.toThrow();
  expect(WTGM.ctx.clearRect).toHaveBeenCalled();
  expect(WTGM.ctx.fillRect).toHaveBeenCalled();
  WTGM.ctx.clearRect.mockClear();
  WTGM.ctx.fillRect.mockClear();

  // we just test fps,
  // which is quite high with this mock data
  WTGM.lastFrame = new Date().getTime() - 1;
  expect(WTGM.loop.bind(WTGM)).not.toThrow();
  expect(WTGM.fps).toBeGreaterThan(60);
});

// draw helpers
test('WTGM should provide draw helpers', () => {
  expect(WTGM.Draw).toBeDefined();
  expect(WTGM.Draw.clear).toBeDefined();
  expect(WTGM.Draw.rect).toBeDefined();
  expect(WTGM.Draw.circle).toBeDefined();
  expect(WTGM.Draw.text).toBeDefined();

  WTGM.ctx = jest.fn();

  // test clear helper
  WTGM.ctx.clearRect = jest.fn();
  WTGM.Draw.clear();
  expect(WTGM.ctx.clearRect.mock.calls[0]).toEqual([
    0,
    0,
    WTGM.WIDTH,
    WTGM.HEIGHT,
  ]);
  WTGM.ctx.clearRect.mockClear();

  // test rect helper
  WTGM.ctx.fillRect = jest.fn();
  WTGM.Draw.rect(10, 20, 30, 40, 'purple');
  expect(WTGM.ctx.fillStyle).toEqual('purple');
  expect(WTGM.ctx.fillRect.mock.calls[0]).toEqual([10, 20, 30, 40]);
  WTGM.ctx.fillRect.mockClear();

  // test circle helper
  WTGM.ctx.beginPath = jest.fn();
  WTGM.ctx.arc = jest.fn();
  WTGM.ctx.closePath = jest.fn();
  WTGM.ctx.fill = jest.fn();
  WTGM.Draw.circle(10, 20, 30, 'pink');
  expect(WTGM.ctx.fillStyle).toEqual('pink');
  expect(WTGM.ctx.beginPath.mock.calls.length).toBe(1);
  expect(WTGM.ctx.arc.mock.calls[0]).toEqual([
    15,
    25,
    30,
    0,
    6.283185307179586,
    true,
  ]);
  expect(WTGM.ctx.closePath.mock.calls.length).toBe(1);
  expect(WTGM.ctx.fill.mock.calls.length).toBe(1);
  WTGM.ctx.beginPath.mockClear();
  WTGM.ctx.arc.mockClear();
  WTGM.ctx.closePath.mockClear();
  WTGM.ctx.fill.mockClear();

  // test text helper
  WTGM.ctx.fillText = jest.fn();
  WTGM.Draw.text('foo', 10, 20, 30, 'yellow');
  expect(WTGM.ctx.font).toEqual('bold 30px Monospace');
  expect(WTGM.ctx.fillStyle).toEqual('yellow');
  expect(WTGM.ctx.fillText.mock.calls[0]).toEqual(['foo', 10, 20]);
  WTGM.ctx.fillText.mockClear();
});
