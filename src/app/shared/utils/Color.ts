export class HSL {
  constructor(public h: number, public s: number, public l: number) {}

  toString(s?: number, l?: number, opacity = 1): string {
    return `hsla(${this.h} ${s || this.s}% ${l || this.l}% / ${opacity})`;
  }

  rotate(deg: number): HSL {
    let newH = this.h + deg;
    if (newH < 0) {
      newH += 360;
    }
    return new HSL(newH % 360, this.s, this.l);
  }

}

export const colorUtils = {

  generateHSL: (id: number): HSL => {
    const num = colorUtils.normalizeNumber(id);
    const h = Math.abs(130 + num * 0.5) % 361;
    const s = Math.abs(35 + ((num % 120) / 120) * (60 - 35)) % 61;
    const l = Math.abs(67 + ((num % 120) / 120) * (77 - 67)) % 78;
    return new HSL(h, s, l);
  },

  normalizeNumber: (n: number): number => {
    const m = (n * 737091 + 9123) % 391371;
    return (m * 319 + 13) % 39171;
  }
}
