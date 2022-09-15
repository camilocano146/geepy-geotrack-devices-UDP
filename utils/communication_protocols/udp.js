var udp = require('dgram');
var buffer = require('buffer'); 

exports.sendMeesage = async(bufferCommand, ip, originPort, destinityPort) => {
    console.log('\x1b[35m', 'app.utils.comunication_protocols.udp.sendMeesage');

    if(bufferCommand!= undefined && originPort!=undefined && destinityPort!= undefined && ip!=undefined){

        let buffer = Buffer.from(bufferCommand);

        let client = udp.createSocket({type: 'udp4', reuseAddr: true});
                        
        client.on('message',(msg,info)=>{
            console.log('Data received from server : ' + msg.toString());
            console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
        });

        client.bind(originPort, () => {
            console.log("-----------start serverUDP.bind-----------");
            // Setting the Send buffer size
            // by using setSendBufferSize() method
            client.setSendBufferSize(65535);
            //client.send(buffer,60000,"34.204.219.9",(err)=>{// servidor ec2
            //client.send(buffer,50000,"191.156.142.114",(err)=>{
            client.send(buffer,destinityPort,ip,(err)=>{// dispositivo
                if(err){
                    console.log(err);
                    client.close();
                }else{
                console.log("-------------Command sent--------------");
                client.close();
                //return callback(null, device)
                }
            });
        });

    }

    

    

}