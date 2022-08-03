const commandService = require('../services/commandService');

exports.send = async(req, res) => {
    console.log('\x1b[35m', 'app.controllers.commandController.send');
    // console.log('holi')
    await commandService.send(req, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                body: err
            })
        }
        return res.status(200).json({
            success: true,
            body: result
        })
    })
}

