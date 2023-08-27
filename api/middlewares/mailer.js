const nodemailer = require('nodemailer');


exports.sendMail = async (req, res, type = null, model = null) => {

    let too = ''; let ccc = ''; let stg = '';
    if (req.get('host') == 'localhost:3000' || req.get('host') == 'example.com') {
        too = 'rautsantoshtukaram@gmail.com';
        ccc = 'rauts6462@gmail.com';
        stg = 'Staging';
    } else {
        too = 'rautsantoshtukaram@gmail.com';
        ccc = 'rauts6462@gmail.com';
        stg = 'Staging';
    };

    let msg = '';
    let subjectTitle = '';
    switch (type) {
        case 'test':
            subjectTitle = 'Testing message';
            msg = 'Testing the gmail';
            break;
    }
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'rautstr@gmail.com',
            pass: process.env.mailPass
        }
    });

    let mailOptions = {
        from: 'rautstr@gmail.com',
        to: too,
        cc: ccc,
        subject: subjectTitle,
        html: msg,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            return res.status(400).send(error);
        } else {
            next();
        }
    });
}