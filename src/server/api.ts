import { createServer, Response } from "miragejs";
import _cities from "./cities.json";
import { City, CityDistance } from "../@types";
import { getHaversineDistance } from "../utils/helpers";

if (window.server) {
  window.server.shutdown();
}

const cities = _cities as City[];

window.server = createServer({
  routes() {
    this.namespace = "api";
    this.timing = 1000;

    // Receives a keyword and returns a list of cities that match the keyword
    this.get("/cities", (schema, request) => {
      const search = request.queryParams.search?.toLocaleLowerCase() || "";

      // Error exception
      if (search === "fail") {
        return new Response(500, {}, { message: "Internal server error" });
      }

      // Filter by keyword and map only city names
      const result = cities
        .filter((city) => city[0].toLocaleLowerCase().includes(search))
        .map((city) => city[0]);

      return result;
    });

    /**
     * Get sub and total distances between cities
     */
    this.get("/distances", (schema, request) => {
      // Get data from query string
      const cityOrigin = JSON.parse(request.queryParams.cityOrigin) || "";
      const cityIntermediates =
        (JSON.parse(
          request.queryParams.cityIntermediates
        ) as any as string[]) || [];
      const cityDestination =
        JSON.parse(request.queryParams.cityDestination) || "";

      const cityNames = [cityOrigin, ...cityIntermediates, cityDestination];

      if (cityNames.length < 2) {
        return new Response(500, {}, { message: "Internal server error" });
      }

      const subDistances: CityDistance[] = [];
      let totalDistance = 0;

      for (let i = 0; i < cityNames.length; i++) {
        // Throws an error in a special case
        if (cityNames[i] === "Dijon") {
          return new Response(500, {}, { message: "Internal server error" });
        }

        if (!Boolean(cityNames[i + 1])) continue;

        // Get city details from data store
        const startCity = cities.find(
          (c) => c[0].toLowerCase() === cityNames[i].toLowerCase()
        );
        const endCity = cities.find(
          (c) => c[0].toLowerCase() === cityNames[i + 1].toLowerCase()
        );

        // Throws an error as no cities found
        if (!startCity || !endCity) {
          return new Response(500, {}, { message: "Internal server error222" });
        }

        const haversineDistance = getHaversineDistance(startCity, endCity);

        subDistances.push([startCity[0], endCity[0], haversineDistance]);
        totalDistance += haversineDistance;
      }

      return {
        subDistances,
        totalDistance: Math.round(totalDistance * 100) / 100,
      };
    });
  },
});
