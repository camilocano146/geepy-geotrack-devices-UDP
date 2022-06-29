let mongoose = require("mongoose");

let deviceIoTSchema = mongoose.Schema({
    imei:{
        type:String
    },
    ip:{
        type:String
    }
});

module.exports = mongoose.model('device_io_t', deviceIoTSchema, "device_io_t");

