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

  private nextDirection?: Vector;

  constructor(snake: Snake, screen: Screen, direction = DIRECTIONS.RIGHT) {
    this.snake = snake;
    this.screen = screen;
    this.direction = direction;
  }

  private getNonSnakePoint = (): Point => {
    const point = this.screen.randomPoint();
    return this.snake.hasPoint(point) ? this.getNonSnakePoint() : point;
  };

  private drawFruit = () => {
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

  private eatFruit = () => {
    this.fruit = undefined;
    this.drawFruit();
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

  setDirection = (newDirection: Vector) => {
    // we just store the value of the next direction.
    // this value is effectively changed on the game tick.
    // reason is: with fast enough inputs you can change the direction several times before the game is drawn and perform an illegal move.
    // example:
    // you are moving RIGHT.
    // Then you press UP and LEFT.
    // Now next direction is LEFT, which would be illegal.
    if (this.isDirectionAllowed(newDirection)) {
      this.nextDirection = newDirection;
    }
  };

  private commitDirectionChange = () => {
    if (!this.nextDirection) return;

    if (this.isDirectionAllowed(this.nextDirection)) {
      this.direction = this.nextDirection;
      this.nextDirection = undefined;
    }
  };

  tick = () => {
    this.screen.clear();
    this.commitDirectionChange();
    this.drawFruit();

    if (this.willEatFruit()) {
      this.eatFruit();
      this.snake.$grow(this.direction, this.screen.fitWithinBorders);
    } else if (this.willHitSnake()) {
      // you died
    } else {
      this.snake.$move(this.direction, this.screen.fitWithinBorders);
    }

    this.screen.drawSnake(this.snake);
    this.updateFrameCount();
  };
}
