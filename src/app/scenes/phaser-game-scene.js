import Phaser from 'phaser';

import GameObjectsBuilder from '../builders/game-objects-builder';
import {BALLS, PREVIEW_TEXT, RESULTS_TEXT, SCENE, SIDES} from '../configs/game-configs';
import touchCounterFactory from '../counter/touch-counter';
import GAME_OBJECT_NAMES from './../constants/game-object-names';

const INTRO_TEXT = 'Put your finger on a blue ball and swipe';

export default class PhaserGameScene extends Phaser.Scene {

  constructor() {
    super('phaser-scene');
    this.balls = undefined;
    this.isRunningGame = false;
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
    this.previewText = this.addPreviewText();
    this.addListenersOnBallsSwiping(pointer => this.handleDownEvent(pointer), pointer => this.handleUpEvent(pointer));
  }

  update() {
    this.handleGoingOutOfBounds();
    if (!this.balls.countActive(true)) {
      this.showResults();
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

  showResults() {
    this.add.text(RESULTS_TEXT.X, RESULTS_TEXT.Y, `Score: ${this.catchedBalls.get()}`, {
      fontSize: RESULTS_TEXT.FONT_SIZE, fill: RESULTS_TEXT.COLOR
    });
  }

  addPreviewText() {
    return this.add.text(PREVIEW_TEXT.X, PREVIEW_TEXT.Y, INTRO_TEXT, {
      fontSize: PREVIEW_TEXT.FONT_SIZE,
      fill: PREVIEW_TEXT.COLOR,
      align: PREVIEW_TEXT.ALIGN,
      wordWrap: {
        width: PREVIEW_TEXT.WIDTH
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

  addListenersOnBallsSwiping(downEventListener, upEventListener) {
    this.balls.children.iterate(ball => ball.on('pointerdown', downEventListener));
    this.input.on('pointerup', upEventListener);
  }

  handleDownEvent({x, y}) {
    this.downX = x;
    this.downY = y;
    this.hidePreviewText();
    this.isRunningGame = true;
  }

  handleUpEvent({x, y}) {
    this.downX && this.downY && this.pushBalls(this.downX, this.downY, x, y);
  }

}
