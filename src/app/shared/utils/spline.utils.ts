type Spline = (t: number) => number;

export const SplineUtils = {
  bSpline0: (): Spline => ((t: number) => 0 >= t && t < 1 ? 1 : 0),

  bSpline: (degree: number): Spline => {
    const bSplinePrev: Spline = degree === 1 ? SplineUtils.bSpline0() : SplineUtils.bSpline(degree - 1);
    return (t: number) => {
      return (t * bSplinePrev(t) + (degree + 1 - t) * bSplinePrev(t - 1)) / degree;
    }
  },

  /**
   * returns function which will take @param t and return {x: number, y: number} object
   * @param points -- array of control points {x: number, y: number}[]
   * @param degree -- degree of the spline ( >= 1 ); default is 2
   */
  getAnimationFunction: (points: any[], degree = 2) => {
    const spline = SplineUtils.bSpline(degree);
    return (t: number) => {
      return points.reduce((acc, cur, i) => {
        acc.x += cur.x * spline(t - i - 1);
        acc.y += cur.y * spline(t - i - 1);
        return acc;
      }, {x: 0, y: 0});
    }
  },

  modDiff: (n1: number, n2: number, mod: number) => {
    return Math.min(
      Math.abs(n1 - n2),
      Math.abs(mod - n1 + n2),
      Math.abs(mod - n2 + n1),
    )
  },

  fastSpline: (points: any[]) => {
    const amount = points.length;
    return (t: number) => {
      const tScaled = (t * amount) % amount;
      return points.reduce((acc, cur, i) => {
        const d = SplineUtils.modDiff(tScaled, i, amount);
        if (d < 2) {
          const weight = d > 1 ? (2 - d) * 0.1 : 0.1 + (1 - d) * 0.7
          acc.x += cur.x * weight;
          acc.y += cur.y * weight;
        }
        return acc;
      }, {x: 0, y: 0});
    }
  }
}
