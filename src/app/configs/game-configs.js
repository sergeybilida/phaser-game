export const SCENE = {
  WIDTH: 500,
  HEIGHT: 800,
  GRAVITY: {
    Y: 200
  },
  BACKGROUND_COLOR: '#fff'
};

export const BALLS = {
  COUNT: 20,
  HIT_AREA: {
    X: -8,
    Y: -8,
    WIDTH: 24,
    HEIGHT: 24
  },
  BOUNCE: {
    DEFAULT: 0.9,
    ACTIVE: 1.4
  },
  VELOCITY: {
    ERROR_X: 150,
    MAX_Y:  -550,
    BOOST: {
      Y: {
        FROM: 3,
        TO: 4
      }
    }
  },
  START_POSITION: {
    X: 200,
    Y: 700,
    WIDTH: 100,
    HEIGHT: 50
  }
};

export const BASKETS = {
  COUNT: 5,
  START_POSITION: {
    X: 50,
    Y: 50,
    WIDTH: 400,
    HEIGHT: 500
  }
};

export const SIDES = {
  MAX_TOUCH_COUNT: 5
};

export const RESULTS_TEXT = {
  X: 120,
  Y: 300,
  COLOR: '#000',
  FONT_SIZE: '32px',
  ALIGN: 'center',
  WIDTH: 300
};

export const PREVIEW_TEXT = {
  X: 60,
  Y: 300,
  COLOR: '#000',
  FONT_SIZE: '24px',
  ALIGN: 'center',
  WIDTH: 400
};

