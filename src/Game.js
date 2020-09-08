import Player from './Player.js';
import Food from './Food.js';
import Wall from './Wall.js';
import GameObject from './GameObject.js';
import GameMap from './GameMap.js';
import Enemy from './Enemy.js';
import { playerAnims } from './animations.js';
import { mapCodes, objectMap } from './map.js';

const gameDiv = document.getElementById('game');

export default class Game {
  constructor(canvas) {
    this.player = new Player(0, 0, 16, 16, null, null, 16, 16, 'player', playerAnims.DOWN);
    this.spawnPlayer();

    this.points = 0;

    // this.mode;
    // this.bgSprites = [];
    this.gameMap = new GameMap(16);
    this.maxEnemies = 4;

    this.intervalId = setInterval(() => {
      if (Enemy.all.length < this.maxEnemies) Enemy.spawn()
    }, 1000);

    Food.spawn();

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scale = 1;

    // logical
    this.width = 224;
    this.height = 288;
    this.maxWidth = this.width * 3;
    this.maxHeight = this.height * 3;
  }

  spawnPlayer() {
    for (let row = 0; row < objectMap[0].length; row++) {
      for (let col = 0; col < objectMap.length; col++) {
        if (objectMap[col][row] === mapCodes.PLAYER) {
          this.player.x = row * 16;
          this.player.y = col * 16;
        }
      }
    }
  }

  resize() {
    let cWidth = window.innerWidth,
      cHeight = window.innerHeight;

    const nativeRatio = this.width / this.height,
      browserWindowRatio = cWidth / cHeight,
      SIZE = 16;

    if (browserWindowRatio > nativeRatio) {
      cHeight = Math.floor(cHeight * 0.9 * SIZE) * SIZE;
      if (cHeight > this.maxWidth) cHeight = this.maxHeight;
      cWidth = Math.floor(cHeight * nativeRatio);
    } else {
      cWidth = Math.floor(cWidth * 0.9 / SIZE) * SIZE;
      if (cWidth > this.maxWidth) cWidth = this.maxWidth;
      cHeight = Math.floor(cWidth / nativeRatio);
    }

    this.canvas.style.width = `${cWidth}px`;
    this.canvas.style.height = `${cHeight}px`;

    this.ctx.imageSmoothingEnabled = false; // remove blurring from resizing
  }

  get canvasHeight() {
    return this.canvas.height;
  }

  get canvasWidth() {
    return this.canvas.width;
  }

  get tileSize() {
    return 16;
  }

  update() {
    this.player.update(this.canvasHeight, this.canvasWidth);
    let foodCarriedIndex;

    Wall.all.forEach(w => {
      if (w.isCollided(this.player)) {
        // TODO move player out of wall
      }
    })

    Food.all.forEach((f, i) => {
      if (this.player.isCollidedWithFood(f) && !this.player.isHolding) {
        f.isCarried = true;
        this.player.isHolding = true;
        this.player.itemHeld = f.type;
      }

      if (f.isCarried) {
        foodCarriedIndex = i;
        f.x = this.player.x + this.player.w / 2 - f.w / 2;
        f.y = this.player.y - f.h + 2
      }
    })

    Enemy.all.forEach((e, i) => {
      e.update(this.player);

      // temporary enemy collision with another enemy
      // const otherEnemies = [...Enemy.all];
      // otherEnemies.splice(i, 1);

      // otherEnemies.forEach(otherEnemy => {
      // TODO find direction they bumped and remove it from valid directions

      // if (otherEnemy.isCollided(e)) {
      //   e.changeDirection();
      //   otherEnemy.changeDirection();
      // }
      // })

      // check for collision with player
      if (e.isCollidedAtCenter(this.player)) {
        if (this.player.isHolding && this.player.itemHeld === e.want) {
          // if player has correct food item, kill enemy
          e.kill(i);
          // destroy food
          Food.destroy(foodCarriedIndex);

          this.player.isHolding = false;
          this.player.itemHeld = null;
          // increase points;
          this.points++;
        } else {
          // kill player
        }
      }

    })

    if (Food.all.length < 2) {
      // create the food that was just fed/eaten
      Food.all[0].type === 'taco' ? Food.createDonut() : Food.createTaco();
    }
  }

  draw(tilesheet) {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.gameMap.draw(this.ctx, this.scale, tilesheet);
    GameObject.all.forEach(obj => obj.draw(this.ctx, this.scale, tilesheet))
  }
}