let Device = require("../models/device");
const connectionDB = require('../database/connection-mongodb');
var udp = require('dgram');

// creating a client socket
var client = udp.createSocket({type: 'udp4', reuseAddr: true});
var buffer = require('buffer'); 


exports.send= async (req, callback) => {
    console.log("app.services.commandService.send");
    let body = req.body;
    await connectionDB().then(async() => {
            await Device.find({"imei":body.imei}).then(device => {

                    let bufferCommand = new Uint8Array(body.data.length/2);
                    //let arrayCommand = [];

                    console.log(body.data.length);
                    
                    let count = 0;
                    for(let i=0; i < body.data.length; i+=2){
                    //for(let i=0; i < body.data.length-1300; i++){
                        let pairHexToDec = hex2dec(body.data[i]+body.data[i+1]);
                        //console.log(body.data[i] + body.data[i+1] + " = " + hex2dec(body.data[i]+body.data[i+1]));
                        bufferCommand[count] = pairHexToDec;
                        count+=1;
                        //arrayCommand.push(pairHexToDec);
                    }

                    const base64String = String.fromCharCode(...bufferCommand);

                    body.data = base64String;
                    body.imei = body.imei + "";
                    
                    client.on('message',(msg,info)=>{
                        console.log('Data received from server : ' + msg.toString());
                        console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
                    });

                    console.log(body);

                    let trailing_bytes = JSON.stringify(body)+"EEEEEEEEE";

                    console.log(trailing_bytes);

                    var data = new Buffer.from(trailing_bytes);

                    console.log(data);

                    // Bind your port here

                    client.bind(50000, () => {
                        console.log("-----------start serverUDP.bind-----------");
                        // Setting the Send buffer size
                        // by using setSendBufferSize() method
                        client.setSendBufferSize(100000);
                        client.send(data,60000,"34.204.219.9",(err)=>{
                        //client.send(data,600,device.ip,(err)=>{
                            if(err){
                                console.log(err);
                                client.close();
                            }else{
                              console.log("-------------Command sent--------------");
                              client.close();
                              return callback(null, device)
                            }
                        });
                    });

                    // buffer size
                    
                    
                    //sending msg
                    //
                    
                    //;
                }).catch(err => {
                    console.log(err);
                    callback(err)   
                    return
                })
        }).catch(err => {
            callback(err)
            return
        })
}

function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

function hex2dec(hex){
    return parseInt(hex, 16);
}
