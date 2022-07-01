let Device = require("../models/device");
const connectionDB = require('../database/connection-mongodb');
let http_factory = require("../utils/communication_protocols/http_factory");
let config = require("../config.json");
const { response } = require("express");
/*
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
*/

exports.updateIpByImei= async (imei, ipSource, callback) => {
    console.log("app.services.deviceIotService.updateIpByImei");
    await connectionDB().then(async() => {
            await Device.findOneAndUpdate({"imei":imei}, {"ip":ipSource},{ new: true }).then(device => {
                    console.log("IP of device:" + imei + "updated");
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

exports.sendToGeepyCloudAPI= async (package) => {
    console.log("app.services.deviceIotService.sendToGeepyCloudAPI");

    let body = {
        "username":config["geepy-cloud-no-auth"].credentials.username,
        "password":config["geepy-cloud-no-auth"].credentials.password,
        "client_id":config["geepy-cloud-no-auth"].credentials.client_id
    };

    let headers = {
        'Content-Type': 'application/json'
    }

    await http_factory.post(config["geepy-cloud-no-auth"].hostname, config["geepy-cloud-no-auth"].path, config["geepy-cloud-no-auth"].port, headers, body,  async function(err, result) {
        if (err) {
            console.log(err);
            return err
        }
        console.log(result);
        let securityToken =  JSON.parse(result);
        let headers_package= {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+securityToken.access_token
        }
        console.log(package);
        package.event = 1;
        package.IMEI = package.imei;
        package.ts = package.timestamp;
        package.lat = package.latitude;
        package.long = package.longitude;
        //let package_parse = JSON.parse(package);
        await http_factory.post(config["geepy-cloud-auth"].hostname, config["geepy-cloud-auth"].path, config["geepy-cloud-auth"].port, headers_package, package,  function(err, result_geo) {
            if (err) {
                console.log(err);
                return err
            }
            console.log(result_geo);
            return result_geo
        });
    });
}