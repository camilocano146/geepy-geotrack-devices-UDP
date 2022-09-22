let Device = require("../models/device");
const connectionDB = require('../database/connection-mongodb');
var udp = require("../utils/communication_protocols/udp");

exports.send= async (req, callback) => {
    console.log("app.services.commandService.send");
    let body = req.body;
    await connectionDB().then(async() => {
            await Device.findOne({"imei":body.imei}).then(async device => {

                    body.imei = body.imei + "";  
                    let count = 0;
                    let firstBlockMessage = '{"imei":"';
                    let secondBlockMessage = '","data":"';
                    let thirdBlockMessage = '"}';   
                    let trailing_bytes = 'EEEEEEEEE';
                    let bufferSize = body.data.length/2 + body.imei.length + firstBlockMessage.length + secondBlockMessage.length + thirdBlockMessage.length + trailing_bytes.length;
                    let bufferCommand = new Uint8Array(bufferSize);
                    let blocksToProcces = [firstBlockMessage,body.imei,secondBlockMessage]
                    
                    for(let i=0; i<blocksToProcces.length; i++){
                        for(let j=0; j < blocksToProcces[i].length; j++){
                            let ascci = blocksToProcces[i].charCodeAt(j);
                            bufferCommand[count] = ascci;
                            count+=1;
                        }
                    }

                    for(let i=0; i < body.data.length; i+=2){
                    //for(let i=0; i < body.data.length-1300; i++){
                        let pairHexToDec = hex2dec(body.data[i]+body.data[i+1]);
                        //console.log(body.data[i] + body.data[i+1] + " = " + hex2dec(body.data[i]+body.data[i+1]));
                        bufferCommand[count] = pairHexToDec;
                        count+=1;
                        //arrayCommand.push(pairHexToDec);
                    }

                    blocksToProcces = [thirdBlockMessage, trailing_bytes ];

                    for(let i=0; i<blocksToProcces.length; i++){
                        for(let j=0; j < blocksToProcces[i].length; j++){
                            let ascci = blocksToProcces[i].charCodeAt(j);
                            bufferCommand[count] = ascci;
                            count+=1;
                        }
                    }

                    console.log(bufferCommand.byteLength);
                    console.log(bufferCommand);
                    
                    let commandString = "";
                    for (let x of bufferCommand) {
                        commandString = commandString +  String.fromCharCode(x);
                    }

                    console.log(commandString);

                    let responseUDP = udp.sendMeesage(bufferCommand, device.ip, 50000, 600);

                    if(!responseUDP){
                        return callback(null, {device:false})
                    }else{
                      console.log("-------------Command sent--------------");
                      return callback(null, device)
                    }

                    /*

                    let buffer = Buffer.from(bufferCommand);

                    console.log(buffer.length);
                    console.log(buffer);

                    let client = udp.createSocket({type: 'udp4', reuseAddr: true});
                    
                    client.on('message',(msg,info)=>{
                        console.log('Data received from server : ' + msg.toString());
                        console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
                    });

                    // Bind your port here

                    client.bind(50000, () => {
                        console.log("-----------start serverUDP.bind-----------");
                        // Setting the Send buffer size
                        // by using setSendBufferSize() method
                        client.setSendBufferSize(65535);
                        //client.send(buffer,60000,"34.204.219.9",(err)=>{// servidor ec2
                        //client.send(buffer,50000,"191.156.142.114",(err)=>{
                        client.send(buffer,600,device.ip,(err)=>{// dispositivo
                            if(err){
                                console.log(err);
                                client.close();
                            }else{
                              console.log("-------------Command sent--------------");
                              client.close();
                              return callback(null, device)
                            }
                        });
                    });*/
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
