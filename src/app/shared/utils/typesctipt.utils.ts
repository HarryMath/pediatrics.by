export type Constructor<T> = new () => T;

export const As = <T>(data: any) => data as T;
