import { Vector, Point } from "./vecpoint";

export class Snake {
  position: Point;
  pieces: Point[];

  constructor(x: number = 0, y: number = 0) {
    this.position = new Point(x, y);
    this.pieces = [new Point(x, y)];
  }

  getLastPiece = () => {
    const lastPiece = this.pieces[this.pieces.length - 1];
    return lastPiece;
  };

  private removeLastPiece = (pieces: Point[]) =>
    pieces.slice(0, pieces.length - 1);

  hasPoint = (p: Point) =>
    this.pieces.some((piece) => Point.AreEqual(piece, p));

  get size() {
    return this.pieces.length;
  }
  $grow = (direction: Vector, fitToScreen = (p: Point) => p) => {
    let nextPosition = fitToScreen(Point.Add(this.position, direction));
    this.position = nextPosition;
    this.pieces = [nextPosition, ...this.pieces];

    return this;
  };

  $move = (direction: Vector, fitToScreen = (p: Point) => p) => {
    let nextPiece = Point.Add(this.position, direction);
    nextPiece = fitToScreen(nextPiece);
    this.position = nextPiece;
    this.pieces = [nextPiece, ...this.removeLastPiece(this.pieces)];

    this.pieces = this.pieces.map(fitToScreen);

    return this;
  };
}
