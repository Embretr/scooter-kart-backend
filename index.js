const express = require('express')
const axios = require("axios")
const fs = require("fs")
const path = require('path');
const app = express()
let lastUpdate = 0;
process.env.TZ = 'Europe/Amsterdam'

class Ridesharer {
    constructor(baseURL, headers){
        this.baseURL = baseURL
        this.axios = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: headers
          })
    }
    getAllBikes(url){
        return this.axios.get(url)
    }
}
class Scooter {
    constructor(brand, location, type,  battery, startPrice, minPrice, code, ID){
        this.brand = brand
        this.location = location
        this.type = type
        this.battery = battery
        this.startPrice = startPrice
        this.minPrice = minPrice 
        this.code = code
        this.ID = ID
    }
}

app.get("/allVehicles",async (req, res)=>{
    try {
        let current = new Date();
    if (current.getHours()<23 && current.getHours()>4&&Math.abs(current - lastUpdate)>120000){
        lastUpdate = current
        const allscooters = []

        var tierApiKey = fs.readFileSync('tierApiKey.txt', 'utf8')
        const tier = new Ridesharer("https://platform.tier-services.io/v1", {"X-Api-Key":tierApiKey.toString()})
        await tier.getAllBikes("/vehicle?zoneId=OSLO").then(resp=>{
            for (x of resp.data.data){
                allscooters.push(new Scooter("tier", {lat:x.attributes.lat, lng:x.attributes.lng}, x.type, x.attributes.batteryLevel, 10, 3, x.attributes.code.toString(), x.id))
            }
        })
        var boltApiKey = fs.readFileSync("boltApiKey.txt", "utf8")
        const bolt = new Ridesharer("https://rental-search.bolt.eu", {"Authorization":boltApiKey.toString()})
        await bolt.getAllBikes("/categoriesOverview?version=CI.58.0&deviceId=6696e189-8b25-445c-b167-2d904f569734&deviceType=iphone&device_name=iPhone13,2&device_os_version=iOS15.4.1&language=en&lat=59.920413&lng=10.717425").then(resp=>{
            for (x of resp.data.data.categories){
                for (y of x.vehicles){
                    allscooters.push(new Scooter("bolt", {lat:y.lat, lng: y.lng}, y.type, y.charge, 0, 3, y.name, y.id.toString()))
                }
            }
        })
        var voiApiKey = fs.readFileSync('voiApiKey.txt', 'utf8');
        const session = await axios.post("https://api.voiapp.io/v1/auth/session", {
            "authenticationToken": voiApiKey.toString()
        })
        var sessionKey = session.data.accessToken
        fs.writeFileSync("voiApiKey.txt", session.data.authenticationToken)
        const voi = new Ridesharer("https://api.voiapp.io/v2", {"x-access-token":sessionKey})
        await voi.getAllBikes("/rides/vehicles?zone_id=27").then(resp=>{
            for (x of resp.data.data.vehicle_groups[0].vehicles){
                allscooters.push(new Scooter("voi", x.location, x.category, x.battery, 10, 3, x.short, x.id))
            }
        })
        fs.writeFileSync("vehicleMap.json", JSON.stringify({data:allscooters}))
    }
    res.sendFile(path.join(__dirname,'vehicleMap.json'))
    } catch (error) {
        console.log(error)
    }
})

app.get("/allVehiclesTesting",(req, res)=>{
    try {
        res.sendFile(path.join(__dirname,'testing.json'))
    } catch (error) {
        console.log(error)
    }
})

app.get('*', function(req, res){
    res.status(404).send(":(")
  });


app.listen(process.env.PORT)






