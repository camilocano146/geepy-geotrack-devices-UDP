let deviceIotService = require("../services/deviceIotService");

exports.proccessUDPMessage = async(message, ipSource) => {
    console.log('\x1b[35m', 'app.processors.proccessUDPMessage.proccessUDPMessage');
    // console.log('holi')
    message = message + "";
    console.log("------------Message------------");
    console.log(message);
    console.log("------------IP------------");
    console.log(ipSource);
    message_parser = JSON.parse(message);
    let numberKeys = Object.keys(message_parser).length;
    if(numberKeys == 1 && message_parser.imei != undefined){
        await deviceIotService.getByImei(message_parser.imei, ipSource, function(err, result) {
            if (err) {
                console.log(err);
                return err
            }
            return result
        });
    }
    
}