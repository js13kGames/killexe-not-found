import { tilesheet, SPRITE_SCALE } from './animations.js';
import { ctx } from "./canvas.js";
import { config } from './config.js';

export default class GameObject {
  static all = [];
  constructor(srcX, srcY, srcW, srcH, x, y, w, h, type, currentAnim = null) {
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcW = srcW;
    this.srcH = srcH;
    this.x = x;
    this.y = y;
    this._w = w;
    this._h = h;
    this.tick = 0;
    this.currentFrame = 0;
    this.type = type;
    this.currentAnim = currentAnim;

    GameObject.all.push(this);
  }

  get w() {
    return this._w * config.scale;
  }

  get h() {
    return this._h * config.scale;
  }

  get centerX() {
    return this.x + this.w / 2;
  }

  get centerY() {
    return this.y + this.w / 2;
  }

  isCollided(obj) {
    return Math.abs(this.centerX - obj.centerX) < this.w / 2 + obj.w / 2 &&
      Math.abs(this.centerY - obj.centerY) < this.h / 2 + obj.h / 2;
  }

  /**
   * TODO
   * collisions
   * boundaries
   * removals
   * draw/render
   * update
   */

  draw() {
    // ctx.drawImage(
    //   tilesheet, this.srcX, this.srcY, this.srcW,
    //   this.srcH, this.x, this.y, this.w * SPRITE_SCALE, this.h * SPRITE_SCALE
    // )
    ctx.drawImage(
      tilesheet, this.srcX, this.srcY, this.srcW,
      this.srcH, this.x, this.y, this.w, this.h
    )
  }

}