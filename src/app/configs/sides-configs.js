import GAME_OBJECT_NAMES from './../constants/game-object-names';
import touchCounterFactory from './../counter/touch-counter';

const SIDES_CONFIGS = [
  {key: GAME_OBJECT_NAMES.V_SIDE, x: 0, y: 0, width: 40, height: 1600, touchCounter: touchCounterFactory()},
  {key: GAME_OBJECT_NAMES.V_SIDE, x: 500, y: 0, width: 40, height: 1600, touchCounter: touchCounterFactory()},
  {key: GAME_OBJECT_NAMES.V_SIDE, x: 0, y: 0, width: 1000, height: 40, touchCounter: touchCounterFactory()},
  {key: GAME_OBJECT_NAMES.V_SIDE, x: 0, y: 800, width: 1000, height: 40, touchCounter: touchCounterFactory()}
];

export default SIDES_CONFIGS;
