import Phaser from 'phaser';

import {BALLS, BASKETS} from '../configs/game-configs';
import SIDES_CONFIGS from '../configs/sides-configs';
import GAME_OBJECT_NAMES from '../constants/game-object-names';
import SideBuilder from './side-builder';

export default class GameObjectsBuilder {
  constructor(scene) {
    this.scene = scene;
  }

  createSides(targetObject, collideWithBallAction) {
    const sideBuilder = new SideBuilder(this.scene);
    SIDES_CONFIGS.forEach(({key, x, y, height, width, touchCounter}) =>
      sideBuilder.add(key, {x, y, width, height}, {
        targetObject,
        collideAction: side => collideWithBallAction(side, touchCounter)
      }));
  }

  createBalls() {
    const balls = this.scene.physics.add.group({key: GAME_OBJECT_NAMES.BALL, frameQuantity: BALLS.COUNT});
    Phaser.Actions.RandomRectangle(balls.getChildren(), {
      width: BALLS.START_POSITION.WIDTH,
      height: BALLS.START_POSITION.HEIGHT,
      x: BALLS.START_POSITION.X,
      y: BALLS.START_POSITION.Y
    });
    balls.children.iterate(ball => {
      ball.setBounce(BALLS.BOUNCE.DEFAULT);
      ball.setInteractive();
    });
    return balls;
  }

  createBaskets() {
    const baskets = this.scene.physics.add.staticGroup({key: GAME_OBJECT_NAMES.BASKET, frameQuantity: BASKETS.COUNT});
    Phaser.Actions.RandomRectangle(baskets.getChildren(), {
      width: BASKETS.START_POSITION.WIDTH,
      height: BASKETS.START_POSITION.HEIGHT,
      x: BASKETS.START_POSITION.X,
      y: BASKETS.START_POSITION.Y
    });
    baskets.refresh();
    return baskets;
  }

}
