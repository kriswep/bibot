/* globals document */
import WTGM from './wtgm';
// import sound from './sound';

export function addListenerMulti(el, s, fn) {
  if (el && s && fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  }
}

export function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export const initUI = () => {
  // addListenerMulti(
  //   document.querySelector('.startGame'),
  //   'mousedown touchstart',
  //   (e) => {
  //     e.preventDefault();
  //     WTGM.setScore();
  //     WTGM.startGame();
  //     document.querySelector('.ui').style.display = 'none';
  //     document.querySelector('canvas').style.display = '';
  //     document.querySelector('.openMenu').style.display = 'inline';
  //   },
  // );
};

ready(initUI);
