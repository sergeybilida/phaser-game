import Phaser from 'phaser';

import './global.scss';
import PhaserGameScene from './scenes/phaser-game-scene';
import {SCENE} from './configs/game-configs';

const config = {
  type: Phaser.AUTO,
  width: SCENE.WIDTH,
  height: SCENE.HEIGHT,
  backgroundColor: SCENE.BACKGROUND_COLOR,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: SCENE.GRAVITY.Y }
    }
  },
  scene: [PhaserGameScene]
}

export default new Phaser.Game(config);
