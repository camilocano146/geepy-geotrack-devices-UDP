let Device = require("../models/device");
const connectionDB = require('../database/connection-mongodb');

exports.list= async function(req, callback) {
    console.log("app.services.deviceIotService.list");
    connectionDB().then(() => {

            Device.find().limit(100).then(devices => {
                    console.log(devices);
                    callback(null, { devices: devices})
                    return
                }).catch(err => {
                    callback(err)
                    return
                })
        }).catch(err => {
            callback(err)
            return
        })
}

exports.getByImei= async (imei, ipSource,callback) => {
    console.log("app.services.deviceIotService.getByImei");
    await connectionDB().then(async() => {
            await Device.findOneAndUpdate({"imei":imei}, {"ip":ipSource},{ new: true }).then(device => {
                    console.log(device);
                    return device
                }).catch(err => {
                    callback(err)
                    return
                })
        }).catch(err => {
            callback(err)
            return
        })
}