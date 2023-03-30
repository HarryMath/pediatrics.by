export type Constructor<T> = new () => T;

export const ObjectUtils = {

  assign: <T>(constructor: Constructor<T>, source: Partial<T>): T => {
    return Object.assign<any, Partial<T>>(new constructor(), source);
  },

  cutEmpty: <T extends Object>(o: T): T => {
    if (o === null || Array.isArray(o)) {
      return o;
    }
    Object.keys(o).forEach(key => {
      if (o[key as keyof T] === null || o[key as keyof T] === undefined) {
        delete o[key as keyof T];
      }
    });
    return o;
  },

  dropDuplicatesBy: <T, G>(set: T[], groupFn: (o: T) => G): T[] => {
    const result = [] as T[];
    const keys = Array.from(new Set(set.map(e => groupFn(e))));
    for (const k of keys) {
      result.push(set.find(e => groupFn(e) === k)!);
    }

    return result;
  },

  groupBy: <T, G>(set: T[], groupFn: (o: T) => G): T[][] => {
    const map = new Map<G, T[]>();
    const keys = Array.from(new Set(set.map(e => groupFn(e))));
    for (const k of keys) {
      map.set(k, set.filter(e => groupFn(e) === k));
    }

    let combinations: T[][] = [ new Array(keys.length) ];

    let i = 0;
    for (const k of keys) {
      const objects = map.get(k)!;

      const duplicatesBatch: T[][] = [];
      for (const o of objects) {
        const duplicate = combinations.map(c => Array.from(c));
        duplicate.forEach(c => c[i] = o);
        duplicatesBatch.push(...duplicate);
      }
      combinations = duplicatesBatch;
      i++;
    }

    return combinations;
  },

  /**
   * WARNING: use only for plane objects (no functions)
   * @param o -- object to be cloned
   */
  deepClone: <T extends Object>(o: T): T => {
    return JSON.parse(JSON.stringify(o));
  },

  normalizeFields: <T extends Object>(o: T, validKeys: string[]): void => {
     for (let v of validKeys) {
       for (let k of Object.keys(o)) {
         if (k.toLowerCase() === v.toLowerCase() && k !== v) {
           o[v as keyof T] = o[k as keyof T];
           delete o[k as keyof T]
         }
       }
     }
  },

  normalizeFieldsBulk: <T extends Object>(objects: T[], validKeys: string[]): void => {
    if (objects.length === 0) {
      return;
    }
    const o = objects[0]
    for (let v of validKeys) {
      for (let k of Object.keys(o)) {
        if (k.toLowerCase() === v.toLowerCase() && k !== v) {
          objects.forEach(o => {
            o[v as keyof T] = o[k as keyof T];
            delete o[k as keyof T]
          })
        }
      }
    }
  }
}

// @ts-ignore
// window.objectUtils = objectUtils;

// objectUtils.createCombinations([
//   {key: 'red', value: 1},
//   {key: 'red', value: 2},
//   {key: 'red', value: 3},
//
//   {key: 'green', value: 4},
//   {key: 'green', value: 5},
//
//   {key: 'blue', value: 6}
// ], 'key')
