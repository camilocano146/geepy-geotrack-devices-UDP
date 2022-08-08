const { off } = require("../models/device");
let deviceIotService = require("../services/deviceIotService");

exports.proccessUDPMessage = async(message, rinfo) => {
    console.log('\x1b[35m', 'app.processors.udpProcessor.proccessUDPMessage');
    message = message + "";
    console.log("IP:PORT------------");
    console.log(rinfo.address+":"+rinfo.port);
    console.log("Message------------");
    console.log(message);

    message_parser = JSON.parse(message);
    let numberKeys = Object.keys(message_parser).length;
    console.log(numberKeys);
    // verifica si tiene solo una clave y si es imei
    if(numberKeys == 1 && message_parser.imei != undefined){
        await deviceIotService.updateIpByImei(message_parser.imei, rinfo.address, function(err, result) {
            if (err) {
                console.log(err);
                return err
            }
            return result
        });
    }
    // verifica si tiene mas de una clave
    else if(numberKeys > 1){

        await deviceIotService.sendToGeepyCloudAPI(message_parser);


    }
    

    
}