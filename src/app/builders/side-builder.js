export default class SideBuilder {

  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.staticGroup();
  }

  add(sideKey, {x = 0, y = 0, width = 0, height = 0}, {targetObject, collideAction} = {}) {
    const currentSide = this.group.create(x, y, sideKey).setDisplaySize(width, height).refreshBody();
    if (targetObject) {
      this.scene.physics.add.collider(currentSide, targetObject, (side, target) =>
        collideAction && collideAction(side, target), null, this.scene);
    }
  }
}
