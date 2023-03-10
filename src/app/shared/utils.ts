export const remToPX = (rem: number): number =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const random = (min: number, max: number): number => min + Math.random() * (max - min);

export const toRadians = Math.PI / 180;
