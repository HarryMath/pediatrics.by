export const mobileWidth = 600;

export const remToPX = (rem: number): number =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const random = (min: number, max: number): number => min + Math.random() * (max - min);

export const toRadians = Math.PI / 180;

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getName = (object: any) => {
  if (!object) {
    return ""
  }
  if (object.name) {
    return object.name;
  }
  return ((object.firstName?.trim() || "") + " " + (object.lastName?.trim() || "") + " " + (object.fatherName?.trim() || "")).trim();
}

export const isMailValid = (value?: string): boolean => {
  if (!value?.includes('@')) {
    return false;
  } else {
    const parts = value.split('@');
    return parts.length === 2 && parts[0].length > 1 && parts[1].length > 2 && parts[1].split('.').length === 2
  }
}

export const DomUtils = {
  remToPX: (rem: number): number =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize),

  pxToRem: (px: number): number =>
    px / parseFloat(getComputedStyle(document.documentElement).fontSize),
}

