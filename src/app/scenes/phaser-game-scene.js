import Phaser from 'phaser';

import GameObjectsBuilder from '../builders/game-objects-builder';
import {BALLS, PREVIEW_TEXT as PREVIEW_TEXT_CONFIG, RESULTS_TEXT, SCENE, SIDES} from '../configs/game-configs';
import touchCounterFactory from '../counter/touch-counter';
import GAME_OBJECT_NAMES from './../constants/game-object-names';

const PREVIEW_TEXT = 'Put your finger on a blue ball and swipe';

export default class PhaserGameScene extends Phaser.Scene {

  constructor() {
    super('phaser-scene');
    this.balls = undefined;
    this.isRunningGame = false;
    this.isGameOver = false;
    this.catchedBalls = touchCounterFactory();
    this.previewText = undefined;
    this.downX = null;
    this.downY = null;
  }

  preload() {
    this.load.image(GAME_OBJECT_NAMES.H_SIDE, 'assets/h-side.png');
    this.load.image(GAME_OBJECT_NAMES.V_SIDE, 'assets/v-side.png');
    this.load.image(GAME_OBJECT_NAMES.BASKET, 'assets/basket.png');
    this.load.image(GAME_OBJECT_NAMES.BALL, 'assets/ball.png');
  }

  create() {
    const gameObjectsBuilder = new GameObjectsBuilder(this);
    this.balls = gameObjectsBuilder.createBalls();
    gameObjectsBuilder.createSides(this.balls, (side, counter) => this.handleCollidingBallWithSide(side, counter));
    const baskets = gameObjectsBuilder.createBaskets();
    this.physics.add.collider(this.balls, this.balls);
    this.physics.add.overlap(this.balls, baskets, ball => this.handleCollidingBallWithBasket(ball), null, this);
    this.previewText = this.showText(PREVIEW_TEXT, PREVIEW_TEXT_CONFIG);
    this.addListenersOnBallsSwiping(pointer => this.handleDownEvent(pointer));
    this.addResetGameListener();
  }

  update() {
    this.handleGoingOutOfBounds();
    if (!this.balls.countActive(true)) {
      this.showText(this.getResultText(), RESULTS_TEXT);
      this.isGameOver = true;
    }
  }

  handleCollidingBallWithBasket(ball) {
    ball.disableBody(true, true);
    this.catchedBalls.next();
  }

  handleCollidingBallWithSide(side, counter) {
    counter.next();
    if (this.isRunningGame && counter.get() > SIDES.MAX_TOUCH_COUNT) {
      side.disableBody(true, true);
    }
  }

  handleGoingOutOfBounds() {
    this.balls.children.iterate(ball => {
      if (this.isBallOutsideOfScene(ball)) {
        ball.disableBody(true, true);
      }
    });
  }

  pushBalls(downX, downY, upX, upY) {
    const velocityRange = this.calculateBallVelocity(upX - downX, upY - downY);
    this.balls.children.iterate(ball => {
      const velocityX = Phaser.Math.Between(velocityRange.x.from , velocityRange.x.to);
      const velocityY = Phaser.Math.Between(velocityRange.y.from , velocityRange.y.to);
        ball.setBounce(BALLS.BOUNCE.ACTIVE);
        ball.setVelocity(velocityX, velocityY);
      }
    );
  }

  isBallOutsideOfScene(ball) {
    const {x, y} = ball;
    return y < 0 || x < 0 || x > SCENE.WIDTH || y > SCENE.HEIGHT;
  }

  showText(text, config) {
    return this.add.text(config.X, config.Y, text, {
      fontSize: config.FONT_SIZE,
      fill: config.COLOR,
      align: config.ALIGN,
      wordWrap: {
        width: config.WIDTH
      }
    });
  }

  hidePreviewText() {
    this.previewText.setVisible(false);
  }

  calculateBallVelocity(diffX, diffY) {
    return {
      x: {
        from: diffX * BALLS.VELOCITY_BOOST.X.FROM,
        to: diffX * BALLS.VELOCITY_BOOST.X.TO
      },
      y: {
        from: diffY * BALLS.VELOCITY_BOOST.Y.FROM,
        to: diffY * BALLS.VELOCITY_BOOST.Y.TO
      }
    }
  }

  addListenersOnBallsSwiping(downEventListener) {
    this.balls.children.iterate(ball => ball.once('pointerdown', downEventListener));
  }

  handleDownEvent({x, y}) {
    this.downX = x;
    this.downY = y;
    this.input.once('pointerup', pointer => this.startGame(pointer));
  }

  startGame({x, y}) {
    if (this.downX && this.downY) {
      this.pushBalls(this.downX, this.downY, x, y);
      this.hidePreviewText();
      this.isRunningGame = true;
    }
  }

  addResetGameListener() {
    this.input.addListener('pointerup', () => {
      if (this.isGameOver) {
        this.scene.restart()
        this.isRunningGame = false;
        this.isGameOver = false;
        this.catchedBalls.reset();
        this.downY = null;
        this.downX = null;
      }
    });
  }

  getResultText() {
    return `Score: ${this.catchedBalls.get()}.\n Touch screen to continue`;
  }
}
