let Device = require("../models/device");
const connectionDB = require('../database/connection-mongodb');
var udp = require('dgram');

// creating a client socket
var client = udp.createSocket('udp4');
var buffer = require('buffer'); 


exports.send= async (req, callback) => {
    console.log("app.services.commandService.send");
    let body = req.body;
    await connectionDB().then(async() => {
            await Device.find({"imei":body.imei}).then(device => {
                    console.log(device);
                    var data = Buffer.from(body.data);
                
                    client.on('message',(msg,info)=>{
                        console.log('Data received from server : ' + msg.toString());
                        console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
                    });

                    // Bind your port here
                    client.bind(50000); 
                      
                    //sending msg
                    client.send(data,600,device.ip,(err)=>{
                        if(err){
                            console.log(err);
                          client.close();
                        }else{
                          console.log('Data sent !!!');
                          return callback(null, device)
                        }
                    });
                    //;
                }).catch(err => {
                    callback(err)   
                    return
                })
        }).catch(err => {
            callback(err)
            return
        })
}
