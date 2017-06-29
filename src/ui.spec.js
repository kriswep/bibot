/* globals test expect jest document Event */
import { ready, addListenerMulti, initUI } from './ui';
import WTGM from './wtgm';

jest.mock('./wtgm', () => ({
  setScore: jest.fn(),
  startGame: jest.fn(),
  toggleBaby: jest.fn(),
}));

test('UI should have addListenerMulti helper', () => {
  const elem = {
    addEventListener: jest.fn(),
  };
  expect(addListenerMulti).toBeDefined();
  expect(addListenerMulti).not.toThrow();
  addListenerMulti(elem, 'evt1 evt2', 'cb');

  expect(elem.addEventListener.mock.calls[0]).toEqual(['evt1', 'cb', false]);
  expect(elem.addEventListener.mock.calls[1]).toEqual(['evt2', 'cb', false]);
});

test('UI should init its UI', () => {
  expect(initUI).toBeDefined();

  expect(initUI).not.toThrow();
});
