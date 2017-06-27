/* globals window document Image localStorage */
import requestAnimFrame from './helpers/animationFrame';

const WTGM = {
  // set up some inital values
  WIDTH: 320,
  HEIGHT: 480,
  scale: 1,
  // the position of the canvas
  // in relation to the screen
  offset: { top: 0, left: 0 },
  objects: [],
  paused: 1,
  touching: 0,
  touchStart: 0,
  touchX: 0,
  touchY: 0,

  init(preloadResources) {
    // the proportion of width to height
    WTGM.RATIO = WTGM.WIDTH / WTGM.HEIGHT;
    // these will change when the screen is resize
    WTGM.currentWidth = WTGM.WIDTH;
    WTGM.currentHeight = WTGM.HEIGHT;
    // WTGM is our canvas element
    WTGM.canvas = document.getElementsByTagName('canvas')[0];
    // it's important to set WTGM
    // otherwise the browser will
    // default to 320x200
    WTGM.canvas.width = WTGM.WIDTH;
    WTGM.canvas.height = WTGM.HEIGHT;
    // the canvas context allows us to
    // interact with the canvas api
    WTGM.ctx = WTGM.canvas.getContext('2d');

    /* Preload!! */
    preloadResources(WTGM.canvas, () => {
      WTGM.tex.src = WTGM.texSrc;
      WTGM.back.src = WTGM.backSrc;

      WTGM.resize(); // we're ready to resize

      WTGM.loop();
    });
  },

  resize() {
    WTGM.currentHeight = window.innerHeight;

    // resize the width in proportion
    // to the new height
    WTGM.currentWidth = WTGM.currentHeight * WTGM.RATIO;

    // set the new canvas style width & height
    // note: our canvas is still 320x480 but
    // we're essentially scaling it with CSS
    WTGM.canvas.style.width = `${WTGM.currentWidth}px`;
    WTGM.canvas.style.height = `${WTGM.currentHeight}px`;

    // the amount by which the css resized canvas
    // is different to the actual (480x320) size.
    WTGM.scale = WTGM.currentWidth / WTGM.WIDTH;
    // position of canvas in relation to
    // the screen
    WTGM.offset.top = WTGM.canvas.offsetTop;
    WTGM.offset.left = WTGM.canvas.offsetLeft;

    // we use a timeout here as some mobile
    // browsers won't scroll if there is not
    // a small delay
    window.setTimeout(() => {
      window.scrollTo(0, 1);
    }, 1);
  },

  translatePixels(x, y) {
    this.x = (x - WTGM.offset.left) / WTGM.scale;
    this.y = (y - WTGM.offset.top) / WTGM.scale;

    return {
      x: this.x,
      y: this.y,
    };
  },

  /**
   * Touch and Mouse-Click
   *
   * @param {any} x
   * @param {any} y
   */
  handleTouch(x, y) {
    const pos = WTGM.translatePixels(x, y);
    WTGM.touchX = pos.x;
    WTGM.touchY = pos.y;
  },

  handleTouchEnd() {
    if (WTGM.touching && !WTGM.paused) {
      WTGM.touchStart = 0;
      WTGM.touching = 0;
    }
  },
  startGame() {},

  endGame() {},
  // WTGM is where all entities will be moved
  // and checked for collisions etc
  update() {
    if (WTGM.life <= 0) {
      WTGM.endGame();
    }
    WTGM.generateBalloon();

    // update objects
    WTGM.objects.forEach((object) => {
      object.update();
    });
    // remove
    WTGM.objects = WTGM.objects.filter(object => !object.remove);
  },

  // WTGM is where we draw all the entities
  render() {
    WTGM.ctx.clearRect(0, 0, WTGM.canvas.width, WTGM.canvas.height);
    WTGM.ctx.fillStyle = '#2222dd'; // '#7c4f22';
    WTGM.ctx.fillRect(0, 0, WTGM.canvas.width, WTGM.canvas.height);
    WTGM.ctx.drawImage(WTGM.back, 0, 0);
    // Objects
    for (let i = 0; i < WTGM.objects.length; i += 1) {
      WTGM.objects[i].draw(WTGM.ctx);
    }
    // FPS
    if (WTGM.showFps) {
      WTGM.Draw.text(Math.round(WTGM.fps), 5, 440, 24, '#333');
    }
  },

  /**
   * the actual loop
   * requests animation frame
   * then proceeds to update and render
   */
  loop() {
    // order new loop
    requestAnimFrame(WTGM.loop);

    if (!WTGM.paused) {
      WTGM.update();
      WTGM.render();
    }

    if (WTGM.showFps) {
      if (!WTGM.lastFrame) {
        WTGM.lastFrame = new Date().getTime();
        WTGM.fps = 0;
      }
      const time = new Date().getTime();
      const delta = (time - WTGM.lastFrame) / 1000;
      WTGM.lastFrame = time;
      WTGM.fps = 1 / delta;
    }
  },
};

WTGM.Draw = {
  clear() {
    WTGM.ctx.clearRect(0, 0, WTGM.WIDTH, WTGM.HEIGHT);
  },

  rect(x, y, w, h, col) {
    WTGM.ctx.fillStyle = col;
    WTGM.ctx.fillRect(x, y, w, h);
  },

  circle(x, y, r, col) {
    WTGM.ctx.fillStyle = col;
    WTGM.ctx.beginPath();
    WTGM.ctx.arc(x + 5, y + 5, r, 0, Math.PI * 2, true);
    WTGM.ctx.closePath();
    WTGM.ctx.fill();
  },

  text(string, x, y, size, color) {
    WTGM.ctx.font = `bold ${size}px Monospace`;
    WTGM.ctx.fillStyle = color;
    WTGM.ctx.fillText(string, x, y);
  },
};

export default WTGM;
