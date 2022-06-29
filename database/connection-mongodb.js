const mongoose = require('mongoose');
const config = require('../config.json');
mongoose.Promise = global.Promise;
let isConnected;

let options = {
  useNewUrlParser: true,

  useUnifiedTopology: true,

}

let url = config.mongodb.url;

module.exports = connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }
  return mongoose.connect(url, options).then(db => {
    isConnected = db.connections[0].readyState;
  });
};
