declare global {
  interface Window {
    server?: function;
  }

  interface Number {
    toRad: () => number;
  }
}

type City = [string, number, number];
type CityDistance = [string, string, number];

export { City, CityDistance };
