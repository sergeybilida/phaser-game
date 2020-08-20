import Phaser from 'phaser';

import GameObjectsBuilder from '../builders/game-objects-builder';
import {BALLS, RESULTS_TEXT, SCENE, SIDES} from '../configs/game-configs';
import touchCounterFactory from '../counter/touch-counter';
import GAME_OBJECT_NAMES from './../constants/game-object-names';

export default class PhaserGameScene extends Phaser.Scene {

  constructor() {
    super('phaser-scene');
    this.balls = undefined;
    this.isRunningGame = false;
    this.catchedBalls = touchCounterFactory();
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
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.up.isDown || this.input.pointer1.isDown) {
      this.pushBalls();
      this.isRunningGame = true;
    }
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

  pushBalls() {
    this.balls.children.iterate(ball => {
        ball.setBounce(BALLS.BOUNCE.ACTIVE);
        if (!this.isRunningGame) {
          ball.setVelocity(Phaser.Math.Between(BALLS.VELOCITY.X.FROM, BALLS.VELOCITY.X.TO),
            Phaser.Math.Between(BALLS.VELOCITY.Y.FROM, BALLS.VELOCITY.Y.TO));
        }
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
}
