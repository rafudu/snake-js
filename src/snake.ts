import { Vector, Point } from "./vecpoint";

export class Snake {
  pieces: Point[];

  constructor(x: number = 0, y: number = 0) {
    this.pieces = [new Point(x, y)];
  }

  get position() {
    return this.pieces[0]; // the position is just the position of the first piece i.e. the 'head'
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
    // to grow we just add a new piece to the front and update
    this.pieces = [nextPosition, ...this.pieces];
    return this;
  };

  $move = (direction: Vector, fitToScreen = (p: Point) => p) => {
    let nextPiece = Point.Add(this.position, direction);
    nextPiece = fitToScreen(nextPiece);
    // to move we just remove the last piece and add the new piece in the front.
    this.pieces = [nextPiece, ...this.removeLastPiece(this.pieces)];
    return this;
  };
}
