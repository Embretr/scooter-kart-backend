const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const ScooterGroup = require("./scooter-group");
require("dotenv").config();

function brandEndpoint(brand) {
  app.get("/" + brand, async (req, res) => {
    if (req.query.location == undefined) {
      res.status(400).send("Bad request");
      return;
    }
    try {
      const company = new ScooterGroup(brand);
      const scooters = await company.getScootersByLocation(req.query.location);
      res.status(200).send(JSON.stringify(scooters));
    } catch (error) {
      console.log(error);
      res.status(404).send("error");
    }
  });
}

brandEndpoint("voi");
brandEndpoint("tier");
brandEndpoint("ryde");
brandEndpoint("lime");

app.post("/getAvailableLocations", async (req, res) => {
  res.status(200).send(JSON.stringify(["OSLO", "TRONDHEIM"]));
});
app.get("*", function (req, res) {
  res.status(404).send(":(");
});

app.listen(process.env.PORT, () => {
  console.log("http://localhost:8080");
});
