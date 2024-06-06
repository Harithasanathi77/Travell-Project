const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
require("dotenv").config();
 

    try {
        const authHeader = req.headers['authorization'];
        console.log(authHeader, '9 line jwtmidware authHeader',)
        if (!authHeader) {
            return res.status(400).send('Token Not found');
        }
        if (authHeader) {
            const token = authHeader.split(' ')[1]; 
         
            console.log('fromjwtverify AccessToken : ' + token);

            if (!token) {
                return res.status(400).send('Token Not found');
            }
            let decode = jwt.verify(token, process.env.JWT_USER_SECRET_KEY);
            req.user = decode.user 
        console.log(req.user ,'req.user from jwt')
            next();
        }

    }
    catch (err) {
        console.log("from access token expired 403" , err);
        return res.status(403).send('token expired')
    }
}