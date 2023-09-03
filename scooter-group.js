const axios = require("axios");
const Scooter = require("./scooter");

class ScooterGroup {
  constructor(brand) {
    this.brand = brand;
    this.axios = axios.create({
      baseURL: this.url,
      timeout: 10000,
      headers: {
        "ET-Client-Name": "sparkesykler_app_ios",
      },
    });
  }
  async getScootersByLocation(location) {
    var scooters = [];
    if (this.brand == "voi") {
      await this.axios
        .get("https://api.entur.io/mobility/v2/gbfs/voi/free_bike_status")
        .then((resp) => {
          for (let scooter of resp.data.data.bikes) {
            if (
              location == "OSLO" &&
              parseFloat(scooter.lat) > 59.8 &&
              parseFloat(scooter.lat) < 60 &&
              parseFloat(scooter.lon) > 10.4 &&
              parseFloat(scooter.lon) < 11
            ) {
              scooters.push(
                new Scooter(
                  this.brand,
                  {
                    lat: scooter.lat,
                    lng: scooter.lon,
                  },
                  scooter.bike_id,
                  scooter.vehicle_type_id,
                  scooter.rental_uris.ios
                )
              );
            } else if (
              location == "TRONDHEIM" &&
              parseFloat(scooter.lat) > 63.3 &&
              parseFloat(scooter.lat) < 63.5 &&
              parseFloat(scooter.lon) > 10.3 &&
              parseFloat(scooter.lon) < 10.5
            ) {
              scooters.push(
                new Scooter(
                  this.brand,
                  {
                    lat: scooter.lat,
                    lng: scooter.lon,
                  },
                  scooter.bike_id,
                  scooter.vehicle_type_id,
                  scooter.rental_uris.ios
                )
              );
            }
          }
        });
    } else if (this.brand == "lime") {
      if (location == "OSLO") {
        await this.axios
          .get(
            "https://data.lime.bike/api/partners/v1/gbfs/oslo/free_bike_status"
          )
          .then((resp) => {
            for (let scooter of resp.data.data.bikes) {
              scooters.push(
                new Scooter(
                  this.brand,
                  {
                    lat: scooter.lat,
                    lng: scooter.lon,
                  },
                  scooter.bike_id,
                  scooter.vehicle_type,
                  null
                )
              );
            }
          });
      } else if (location == "TRONDHEIM") {
      }
    } else if (this.brand == "tier") {
      if (location == "OSLO") {
      } else if (location == "TRONDHEIM") {
        await this.axios
          .get(
            "https://api.entur.io/mobility/v2/gbfs/tiertrondheim/free_bike_status"
          )
          .then((resp) => {
            for (let scooter of resp.data.data.bikes) {
              console.log(scooter);
              scooters.push(
                new Scooter(
                  this.brand,
                  {
                    lat: scooter.lat,
                    lng: scooter.lon,
                  },
                  scooter.id,
                  scooter.vehicle_type_id,
                  scooter.rental_uris.ios
                )
              );
            }
          });
      }
    } else if (this.brand == "ryde") {
      if (location == "OSLO") {
        await this.axios
          .get(
            "https://api.entur.io/mobility/v2/gbfs/rydeoslo/free_bike_status"
          )
          .then((resp) => {
            for (let scooter of resp.data.data.bikes) {
              scooters.push(
                new Scooter(
                  this.brand,
                  {
                    lat: scooter.lat,
                    lng: scooter.lon,
                  },
                  scooter.bike_id,
                  scooter.vehicle_type_id,
                  scooter.rental_uris.ios
                )
              );
            }
          });
      } else if (location == "TRONDHEIM") {
        await this.axios
          .get(
            "https://api.entur.io/mobility/v2/gbfs/rydetrondheim/free_bike_status"
          )
          .then((resp) => {
            for (let scooter of resp.data.data.bikes) {
              scooters.push(
                new Scooter(
                  this.brand,
                  {
                    lat: scooter.lat,
                    lng: scooter.lon,
                  },
                  scooter.bike_id,
                  scooter.vehicle_type_id,
                  scooter.rental_uris.ios
                )
              );
            }
          });
      }
    }
    return scooters;
  }
}

module.exports = ScooterGroup;
