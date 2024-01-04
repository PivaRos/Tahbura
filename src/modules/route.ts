import { getDistanceKm } from "../utils/helper";

class Route {
  private points: { lat: number; long: number }[] = [];

  constructor(points: { lat: number; long: number }[]) {
    this.points = points;
  }

  getPoints = () => {
    return this.points;
  };

  getKmLength = () => {
    let sum = 0;
    for (let i = 0; i < this.points.length; i++) {
      if (i) {
        sum += getDistanceKm(this.points[i - 1], this.points[i]);
      }
    }
    return sum;
  };
}

export default Route;
