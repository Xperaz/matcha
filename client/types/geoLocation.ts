export interface IUserAddres {
  lat: number;
  long: number;
  [key: string]: any;
}

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface GeolocationPosition {
  readonly coords: Coordinates;
  readonly timestamp: number;
}
