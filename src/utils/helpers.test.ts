import { toRadians, getHaversineDistance } from "./helpers";

describe("function toRadians", () => {
  test("Should return correct number type value", () => {
    expect(typeof toRadians(0)).toBe("number");
    expect(typeof toRadians(10)).toBe("number");
    expect(typeof toRadians(-100)).toBe("number");
    expect(typeof toRadians(1000)).toBe("number");
    expect(typeof toRadians(320)).toBe("number");
  });

  test("Should return correct radian value", () => {
    expect(toRadians(0)).toBe(0);
    expect(toRadians(180)).toBe(Math.PI);
    expect(toRadians(90)).toBe(Math.PI / 2);
  });
});

describe("function getHaversineDistance", () => {
  test("Should return correct distance value", () => {
    expect(getHaversineDistance(["city1", 0, 0], ["city2", 0, 0])).toBe(0);
    expect(getHaversineDistance(["city1", 0, 0], ["city2", 50, 50])).toBe(
      7293.89
    );
    expect(getHaversineDistance(["city1", 0, 0], ["city2", 100, 100])).toBe(
      9815.41
    );
    expect(getHaversineDistance(["city1", 0, 0], ["city2", 150, 150])).toBe(
      4604.54
    );
    expect(getHaversineDistance(["city1", 0, 0], ["city2", 200, 200])).toBe(
      3112.45
    );
  });
});

export {};
