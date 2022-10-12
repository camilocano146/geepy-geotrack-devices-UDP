
const https = require('https');


exports.getHeaders = async() => {
    console.log('\x1b[35m', 'app.utils.comunication_protocols.http_factory.getHeaders');

 
}

exports.post = async(hostname, path, port, headers, body) => {
    console.log('\x1b[35m', 'app.utils.comunication_protocols.http_factory.post');

    var postData = JSON.stringify(body);

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
      };
      
      /*
      const req = await https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        //console.log('headers:', res.headers);
      
        res.on('data', (response) => {
          console.log("on");
          callback(null, response+"");
        });

      });
      
      req.on('error', (error) => {
        callback(error, null);
      });

      req.write(postData);
      req.end();*/


      return new Promise((resolve,reject) => {
        let body = '';

        const req = https.request(options, (res) => {

          console.log('statusCode:', res.statusCode);

          res.on('data', (chunk) => (body += chunk.toString()));

          res.on('error', reject);

          res.on('end', () => {

               resolve(body+"");

          });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
      });
}
