import { Screen } from "./screen";
import { Snake } from "./snake";
import { DIRECTIONS, SnakeGame } from "./game";

const scaleFactor = 15;

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

export function game(canvas: HTMLCanvasElement) {
  const snake = new Snake(0, 0);
  const screen = new Screen(canvas, {
    width: DIMENSIONS.WIDTH,
    height: DIMENSIONS.HEIGHT,
    scaleFactor,
  });

  const game = new SnakeGame(snake, screen, DIRECTIONS.RIGHT);

  game.tick();
  setInterval(game.tick, 1000 / DIFFICULTY.MEDIUM);

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
