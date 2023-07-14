import { Point } from "./vecpoint";
import { Snake } from "./snake";

export class Screen {
  static WIDTH = "WIDTH";
  static HEIGHT = "HEIGHT";

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  width: number;
  height: number;
  scaleFactor: number;

  constructor(
    canvas: HTMLCanvasElement,
    {
      width,
      height,
      scaleFactor = 1,
    }: { width: number; height: number; scaleFactor: number }
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.canvas = canvas!;
    this.width = width;
    this.height = height;
    this.scaleFactor = scaleFactor;
  }

  private toPixel = (num: number = 1) => num * this.scaleFactor;
  private radians = (angle: number) => (angle * Math.PI) / 180;

  fitWithinBorders = (point: Point) => {
    // returns a new point that fits inside the boundaries of the screen
    const newX = point.x < 0 ? this.width - 1 : point.x % this.width;
    const newY = point.y < 0 ? this.height - 1 : point.y % this.height;

    return new Point(newX, newY);
  };

  clear = () => {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  drawSquare = (p: Point) => {
    this.ctx.fillStyle = "green";
    const width = this.toPixel(1);
    const height = this.toPixel(1);
    this.ctx.fillRect(this.toPixel(p.x), this.toPixel(p.y), width, height);
  };

  drawFruit = (point: Point) => {
    this.ctx.fillStyle = "red";
    const radius = this.toPixel(0.5);

    this.ctx.beginPath();
    this.ctx.arc(
      this.toPixel(point.x) + radius,
      this.toPixel(point.y) + radius,
      radius,
      this.radians(0),
      this.radians(360)
    );
    this.ctx.fill();
  };

  drawSnake = (snake: Snake) => {
    snake.pieces.forEach((piece) => {
      this.drawSquare(piece);
    });
    return snake;
  };

  randomPoint = () => {
    const [x, y] = [this.width - 1, this.height - 1].map((v) =>
      Math.round(Math.random() * v)
    );
    return new Point(x, y);
  };
}
