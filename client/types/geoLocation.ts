export interface IUserAddres {
  lat: number;
  lon: number;
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
