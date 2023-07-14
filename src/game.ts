import { Point, Vector } from "./vecpoint";
import { Screen } from "./screen";
import { Snake } from "./snake";

const scaleFactor = 9;

enum DIFFICULTY {
  EASIEST = 1,
  EASY = 10,
  MEDIUM = 15,
  HARD = 18,
  HARDEST = 23,
}

export const DIMENSIONS = {
  WIDTH: 30,
  HEIGHT: 30,
} as const;

const DIRECTIONS = {
  RIGHT: new Vector(1, 0),
  LEFT: new Vector(-1, 0),
  UP: new Vector(0, -1),
  DOWN: new Vector(0, 1),
};

class SnakeGame {
  snake: Snake;
  screen: Screen;
  direction: Vector;
  private fruit?: Point;
  private frameCount: number = 0;

  constructor(snake: Snake, screen: Screen, direction = DIRECTIONS.RIGHT) {
    this.snake = snake;
    this.screen = screen;
    this.direction = direction;
  }
  private generateFruit = () => {
    this.fruit ||= this.screen.randomPoint();
    this.screen.drawFruit(this.fruit);
  };

  private updateFrameCount = () => {
    this.frameCount =
      (this.frameCount + 1) % (this.screen.width * this.screen.height);
  };

  private willEatFruit = () => {
    const nextPosition = Point.Add(this.snake.position, this.direction);
    return Point.AreEqual(nextPosition, this.fruit!);
  };

  private eatFruitAndGrow = () => {
    this.fruit = undefined;
    this.snake.$grow(this.direction, this.screen.fitWithinBorders);
    this.generateFruit();
  };

  private isDirectionAllowed = (newDirection: Vector) => {
    switch (this.direction) {
      case DIRECTIONS.LEFT:
      case DIRECTIONS.RIGHT:
        return [DIRECTIONS.UP, DIRECTIONS.DOWN].some((direction) =>
          Vector.AreEqual(direction, newDirection)
        );

      case DIRECTIONS.UP:
      case DIRECTIONS.DOWN:
        return [DIRECTIONS.LEFT, DIRECTIONS.RIGHT].some((direction) =>
          Vector.AreEqual(direction, newDirection)
        );
    }
  };
  setDirection = (direction: Vector) => {
    if (this.isDirectionAllowed(direction)) {
      this.direction = direction;
    }
  };

  tick = () => {
    this.screen.clear();
    this.generateFruit();
    this.willEatFruit()
      ? this.eatFruitAndGrow()
      : this.snake.$move(this.direction, this.screen.fitWithinBorders);

    this.screen.drawSnake(this.snake);
    this.updateFrameCount();
  };
}
export function game(canvas: HTMLCanvasElement) {
  let direction = DIRECTIONS.RIGHT;
  canvas.width = DIMENSIONS.WIDTH * scaleFactor;
  canvas.height = DIMENSIONS.HEIGHT * scaleFactor;

  const screen = new Screen(canvas, {
    width: DIMENSIONS.WIDTH,
    height: DIMENSIONS.HEIGHT,
    scaleFactor,
  });
  const snake = new Snake(2, 0);

  const game = new SnakeGame(snake, screen, direction);
  game.tick();
  setInterval(game.tick, 1000 / DIFFICULTY.HARDEST);

  window.addEventListener("keydown", (e) => {
    let direction;
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        direction = DIRECTIONS.UP;
        break;

      case "KeyA":
      case "ArrowLeft":
        direction = DIRECTIONS.LEFT;
        break;
      case "KeyS":
      case "ArrowDown":
        direction = DIRECTIONS.DOWN;
        break;
      case "KeyD":
      case "ArrowRight":
        direction = DIRECTIONS.RIGHT;
        break;
    }

    direction && game.setDirection(direction);
  });
}

// const getRandomDirection = (direction: Vector) => {
//   const getRandomValue = (arr: any[]) => {
//     return arr.sort(() => (Math.random() < 0.5 ? -1 : 1))[0];
//   };

//   switch (direction) {
//     case DIRECTIONS.LEFT:
//     case DIRECTIONS.RIGHT:
//       return getRandomValue([DIRECTIONS.UP, DIRECTIONS.DOWN]);

//     case DIRECTIONS.UP:
//     case DIRECTIONS.DOWN:
//       return getRandomValue([DIRECTIONS.LEFT, DIRECTIONS.RIGHT]);
//   }
// };
