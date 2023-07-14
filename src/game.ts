import { Point, Vector } from "./vecpoint";
import { Screen } from "./screen";
import { Snake } from "./snake";

export const DIRECTIONS = {
  RIGHT: new Vector(1, 0),
  LEFT: new Vector(-1, 0),
  UP: new Vector(0, -1),
  DOWN: new Vector(0, 1),
} as const;

export class SnakeGame {
  snake: Snake;
  screen: Screen;
  direction: Vector;
  private fruit?: Point;
  private frameCount: number = 0;
  private acceptInput: boolean = false;

  constructor(snake: Snake, screen: Screen, direction = DIRECTIONS.RIGHT) {
    this.snake = snake;
    this.screen = screen;
    this.direction = direction;
  }

  private blockInputs = () => {
    this.acceptInput = false;
  };

  private allowInputs = () => {
    this.acceptInput = true;
  };

  private getNonSnakePoint = (): Point => {
    const point = this.screen.randomPoint();
    return this.snake.hasPoint(point) ? this.getNonSnakePoint() : point;
  };

  private generateFruit = () => {
    this.fruit ||= this.getNonSnakePoint();

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

  private willHitSnake = () => {
    const nextPosition = Point.Add(this.snake.position, this.direction);
    return this.snake.hasPoint(nextPosition);
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
        return (
          Vector.AreEqual(newDirection, DIRECTIONS.UP) ||
          Vector.AreEqual(newDirection, DIRECTIONS.DOWN)
        );

      case DIRECTIONS.UP:
      case DIRECTIONS.DOWN:
        return (
          Vector.AreEqual(newDirection, DIRECTIONS.LEFT) ||
          Vector.AreEqual(newDirection, DIRECTIONS.RIGHT)
        );
    }
  };

  setDirection = (direction: Vector) => {
    if (!this.acceptInput) {
      return;
    }
    if (this.isDirectionAllowed(direction)) {
      this.direction = direction;
      this.blockInputs(); // We need to wait for this input to be processed before acceepting a new one
    }
  };

  tick = () => {
    this.screen.clear();
    this.generateFruit();
    if (this.willEatFruit()) {
      this.eatFruitAndGrow();
    } else if (this.willHitSnake()) {
      // you died
    } else {
      this.snake.$move(this.direction, this.screen.fitWithinBorders);
    }

    this.allowInputs(); // we processed the last input, we can accept a new one
    this.screen.drawSnake(this.snake);
    this.updateFrameCount();
  };
}
