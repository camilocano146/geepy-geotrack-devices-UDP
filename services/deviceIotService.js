let Device = require("../models/device");
const connectionDB = require('../database/connection-mongodb');
let http_factory = require("../utils/communication_protocols/http_factory");
let config = require("../config.json");
const { response } = require("express");
var udp = require("../utils/communication_protocols/udp");

const list = async function() {
    console.log("app.services.deviceIotService.list");
    return new Promise((resolve, reject) => {
    connectionDB().then(() => {
            Device.find({ ip: { $ne: null } }).limit(100).then(devices => {
                resolve(devices)
                }).catch(err => {
                    reject(err)
                })
        }).catch(err => {
            reject(err);
        });
    });
}

exports.updateIpByImei= async (imei, ipSource, callback) => {
    console.log("app.services.deviceIotService.updateIpByImei");
    await connectionDB().then(async() => {
            await Device.findOneAndUpdate({"imei":imei}, {"ip":ipSource},{ new: true }).then(device => {
                    console.log("Updated IP of device:" + imei);
                    return callback(null, device)
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

    //await http_factory.post(config["geepy-cloud-no-auth"].hostname, config["geepy-cloud-no-auth"].path, config["geepy-cloud-no-auth"].port, headers, body, function(err, result) {

        let response_token = await http_factory.post(config["geepy-cloud-no-auth"].hostname, config["geepy-cloud-no-auth"].path, config["geepy-cloud-no-auth"].port, headers, body);
        let securityToken =  JSON.parse(response_token);
        let headers_package= {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+securityToken.access_token
        }
        let package_parse = normalizePackage(package);

        console.log(package_parse);

        let response_send = await http_factory.post(config["geepy-cloud-auth"].hostname, config["geepy-cloud-auth"].path, config["geepy-cloud-auth"].port, headers_package, package_parse);

        console.log(response_send);

        return response_send;
    //});
}

function normalizePackage(package){
    console.log("app.services.deviceIotService.normalizePackage");
    console.log(package);
    let package_to_send = {};
    package_to_send.sat = 0;
    package_to_send.alt = 0;
	package_to_send.dist = 0;
	package_to_send.spd = 0;
    package_to_send.bat = 0;
    package_to_send.protocol = 0;
    package_to_send.event = 1;
	package_to_send.data = {};


    if(package.imei != undefined){
        package_to_send.IMEI = parseInt(package.imei);
    }else if(package.id!= undefined){
        if(package.id.imei!= undefined){
            package_to_send.IMEI = parseInt(package.id.imei);
        }
        if(package.id.trTS!= undefined){
            package_to_send.ts = parseInt(package.id.trTS);
        }
        delete package.id;
    }
    if(package.timestamp != undefined){
        package_to_send.ts = parseInt(package.timestamp);
    }

    if(package.latitude != undefined){
        package_to_send.lat = parseFloat(package.latitude);
    }else if(package.trLat != undefined){
        package_to_send.lat = parseFloat(package.trLat);
    }

    if(package.longitude != undefined){
        package_to_send.long = parseFloat(package.longitude);
    }else if(package.trLong != undefined){
        package_to_send.long = parseFloat(package.trLong);
    }

    if(package.altitude != undefined){
        package_to_send.alt = parseFloat(package.altitude);
    }else if(package.trAlt != undefined){
        package_to_send.alt = parseFloat(package.trAlt);
    }

    if(package.satelital!= undefined){
        package_to_send.sat = parseFloat(package.satelital);
    }else if(package.trSat != undefined){
        package_to_send.sat = parseFloat(package.trSat);
    }

    // datos de campo data
    if(package.batt_volt != undefined){
        package_to_send.data.batt_volt = package.batt_volt;
    }
    if(package.current != undefined){
        package_to_send.data.current = package.current;
    }
    if(package.capacity != undefined){
        package_to_send.data.capacity = package.capacity;
    }
    if(package.device_ID != undefined){
        package_to_send.data.device_ID = package.device_ID;
    }
    
    return package_to_send;
}

exports.startHeartBeat = async () => {
    console.log("app.services.deviceIotService.startHeartBeat");
    proccessDevice();
}


async function proccessDevice(){
	console.log("app.services.deviceIotService.proccessDevice");
	//await list(true, function(err, result) {
    setTimeout(async() => {
        let devices = await list();
		if(devices!=undefined){
			for(let i=0; i<devices.length; i++){
				let ip = devices[i].ip;
				console.log(ip);
                sendKeepAliveCommandUDP(ip);
			}
		}
    proccessDevice();
    }, 10000);

}

function sendKeepAliveCommandUDP(ip){
    let keep_alive = "keep aliveEEEEEEEEE";
    let bufferCommand = new Uint8Array(keep_alive.length);
    let count = 0;
    for(let j=0; j < keep_alive.length; j++){
        let ascci = keep_alive.charCodeAt(j);
        bufferCommand[count] = ascci;
        count+=1;
    }
    
    udp.sendMeesage(bufferCommand, ip, 50000, 600);
}