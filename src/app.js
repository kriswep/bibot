/* global window document */
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import WTGM from './wtgm';
import ResourceLoader, { ResourceType } from './resourceLoader';
import './ui';

import './css/main.css';
// import './css/ui.css';

/* eslint-disable no-console */
export const updateHandler = {
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },
  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  },
};
/* eslint-enable no-console */
OfflinePluginRuntime.install(updateHandler);

export default function preloadResources(canvas, callback) {
  function printProgressBar() {}

  const rl = new ResourceLoader(printProgressBar, callback);

  // rl.addResource('./img/sprite.png', null, ResourceType.IMAGE);
  // rl.addResource('./img/back.png', null, ResourceType.IMAGE);

  rl.startPreloading();

  printProgressBar();
}

window.addEventListener('load', WTGM.init.bind(null, preloadResources));
window.addEventListener('resize', WTGM.resize);
window.addEventListener('keydown', WTGM.handleKeyDown);

function touchEndHandler() {
  WTGM.handleTouchEnd();
}

function touchHandler(event) {
  WTGM.handleTouch(event.pageX, event.pageY);
}

window.addEventListener('mousedown', (e) => {
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  touchHandler(e);
});
document.querySelector('canvas').addEventListener('mousemove', (e) => {
  touchHandler(e);
});
window.addEventListener('mouseup', (e) => {
  touchEndHandler(e);
});

window.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    WTGM.touching = 1;
    WTGM.touchStart = new Date().getTime();
    // touchHandler(e.touches[0]);
    Array.from(e.touches).map(touch => touchHandler(touch));
  },
  false,
);
window.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
    Array.from(e.touches).map(touch => touchHandler(touch));
  },
  false,
);

window.addEventListener(
  'touchend',
  (e) => {
    // Verhindert Scrollen/Unnötiges Bewegen nach oben oder unten
    e.preventDefault();
    touchEndHandler();
  },
  false,
);
