const deviceIotService = require('../services/deviceIotService');

exports.list = async(req, res) => {
    console.log('\x1b[35m', 'app.controllers.deviceIotController.list');
    // console.log('holi')
    await deviceIotService.list(req, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                body: err
            });
        }
        return res.status(201).json({
            success: true,
            body: result
        })
    })
}

exports.getByImei = async(imei, res) => {
    console.log('\x1b[35m', 'app.controllers.deviceIotController.getByImei');
    // console.log('holi')
    await deviceIotService.getByImei(imei, function(err, result) {
        if (err) {
            console.log(err);
            return err
        }
        return result
    })
}

