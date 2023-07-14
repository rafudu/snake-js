export class Point {
  x: number;
  y: number;

  static AreEqual(pointA: Point, pointB: Point) {
    return pointA.x === pointB.x && pointA.y === pointB.y;
  }

  static Add(point: Point, vector: Vector) {
    return new Point(point.x + vector.x, point.y + vector.y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Vector {
  x: number;
  y: number;

  static AreEqual(vecA: Point, vecB: Point) {
    return vecA.x === vecB.x && vecA.y === vecB.y;
  }

  static Add(vectorA: Vector, vectorB: Vector) {
    return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
