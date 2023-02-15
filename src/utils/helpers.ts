import { City } from "../@types";

/**
 * @desc Convert a number to radian value
 * @params { number } x
 * @returns { number } radian value
 */
const toRadians = (x: number): number => {
  return (x * Math.PI) / 180;
};

/**
 * @desc get Haversine distance between two points
 * @params { City } startCity
 * @params { City } endCity
 * @returns { number } distance in km
 */
const getHaversineDistance = (startCity: City, endCity: City): number => {
  const R = 6371; // km

  const lat1 = startCity[1];
  const lon1 = startCity[2];

  const lat2 = endCity[1];
  const lon2 = endCity[2];

  const x1 = lat2 - lat1;
  const dLat = toRadians(x1);
  const x2 = lon2 - lon1;
  const dLon = toRadians(x2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 100) / 100;
};

export { toRadians, getHaversineDistance };
