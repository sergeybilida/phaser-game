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
  BOUNCE: {
    DEFAULT: 0.9,
    ACTIVE: 1.4
  },
  VELOCITY: {
    X: {
      FROM: -250,
      TO: 250
    },
    Y: {
      FROM: -400,
      TO: -500
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
  X: 100,
  Y: 300,
  COLOR: '#000',
  FONT_SIZE: '54px'
};

export const PREVIEW_TEXT = {
  X: 30,
  Y: 300,
  COLOR: '#000',
  FONT_SIZE: '24px'
};

