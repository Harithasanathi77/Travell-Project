const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userData = require('../models/userData')
const GoogleUserData = require("../models/googleUserData")
const nodemailer = require("nodemailer");
const jwtAuthorization = require('../utils/jwtmiddleware');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const upload = require('../utils/multer');
const s3 = require('../utils/awss3Config');


router.post("/registration", async (req, res) => {

    let checked
    try {
        checked = await userData.findOne({ email: req.body.email })
        console.log(req.body.email)
        if (!checked) {
            checked = await GoogleUserData.findOne({ email: req.body.email })

        }

    } catch (err) {
        console.log(err)
    }
    if (checked) {
        return res.status(400).send({ message: 'User already exists' });
    } else {

        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds)
            .then(async hashedPassword => {
                console.log('Hashed password:', hashedPassword);
                const postData = await userData.create({
                    email: req.body.email,
                    userName: req.body.userName,
                    password: hashedPassword,
                    phoneNumber: req.body.phoneNumber,
                });
                if (!postData) {
                    return res.status(400).send({ message: 'User Not Saved' });
                }
                console.log(postData, 'from postdata')
                let payload = {
                    user: {
                        id: postData.id
                    }
                }
                const accessToken = jwt.sign(payload, process.env.JWT_USER_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE })
                token = accessToken
                console.log("AccessToken:" + accessToken)
                return res.json({ postData, token })
            })
            .catch(err => {
                console.error('Error hashing password:', err);
                return res.status(400).send({ message: 'password encryption failed' });
            });
    }
})



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email + password + "from input")
        let checked;
        try {
            checked = await userData.findOne({ email: req.body.email, isActive: true })
            console.log(checked + "from db")
        } catch (err) {
            console.log(err)
        }

        if (!checked) {
            checked = await GoogleUserData.findOne({ email: req.body.email, isActive: true })
        }
        if (!checked) {
            return res.status(400).send({ message: 'User Not Found' });
        }

        console.log(checked.email, 'checked.email')

        if (checked) {
            bcrypt.compare(password, checked.password, (err, success) => {
                if (err) {
                    // Handle error
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Server Error')

                } else {
                    // Use the result of the comparison
                    console.log('Passwords match:', success);

                    if (success) {
                        let payload = {
                            user: {
                                id: checked.id
                            }
                        }
                        const accessToken = jwt.sign(payload, process.env.JWT_USER_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE })
                        token = accessToken
                        console.log("AccessToken:" + accessToken)
                        res.cookie('AccessToken', token, { maxAge: 24 * 60 * 60 * 1000 })
                        return res.json({ checked, token })
                    } else {
                        return res.status(400).send({ message: 'Wrong Password' });

                    }


                }
            });

        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }

})

function generateOTP() {
    //generates 6  random digits
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('Generated OTP:', otp);
    return otp
}

router.post("/senduseremailotp", async (req, res) => {
    console.log()
    let email;
    try {
        let data;
        data = await userData.findOne({ email: req.body.email });
        if (!data) {
            data = await GoogleUserData.findOne({ email: req.body.email });
        }
        if (!data) {
            return res.status(400).send({ message: 'User Not Found' });
        }
        email = data.email
    } catch (error) {

    }
    console.log(email);
    const otp = generateOTP();
    let mailOptions = {
        from: process.env.SENT_EMAIL,
        to: email,
        subject: "Verify otp",
        text: `Your OTP is: ${otp}`,
    };
    let transporter = nodemailer.createTransport({
        service: process.env.SENT_HOST,
        auth: {
            user: process.env.SENT_EMAIL,
            pass: process.env.SENT_PASSWORD
        }
    });
    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully!");
            const expiration = new Date(new Date().getTime() + 1 * 60000);
            let data;
            data = await userData.findOneAndUpdate({ email: req.body.email }, { otp: otp, expiration: expiration }, { new: true });
            if (!data) {
                data = await GoogleUserData.findOneAndUpdate({ email: req.body.email }, { otp: otp, expiration: expiration }, { new: true });
            }
            if (data) {
                let payload = {
                    user: {
                        id: data.id
                    }
                }
                console.log(data.id, 'new login')
                const accessToken = jwt.sign(payload, process.env.JWT_USER_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE })
                token = accessToken
                console.log("AccessToken:" + accessToken)
                console.log(data, 'from send otp')
                res.cookie('ForgetToken', token, { maxAge: 24 * 60 * 60 * 1000 })
                return res.status(200).json({ message: 'OTP send successfully', token });
            }

        }
    });
})
router.get("/resenduseremailotp", jwtAuthorization, async (req, res) => {
    let email;
    try {
        let data;
        data = await userData.findOne({ _id: req.user.id });
        if (!data) {
            data = await GoogleUserData.findOne({ _id: req.user.id });
        }
        if (!data) {
            return res.status(400).send({ message: 'User Not Found' });

        }
        email = data.email
    } catch (error) {

    }
    console.log(email);
    const otp = generateOTP();
    let mailOptions = {
        from: process.env.SENT_EMAIL,
        to: email,
        subject: "Verify otp",
        text: `Your OTP is: ${otp}`,
    };
    let transporter = nodemailer.createTransport({
        service: process.env.SENT_HOST,
        auth: {
            user: process.env.SENT_EMAIL,
            pass: process.env.SENT_PASSWORD
        }
    });
    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email Resent successfully!");
            const expiration = new Date(new Date().getTime() + 1 * 60000);
            let data;
            data = await userData.findOneAndUpdate({ email: email }, { otp: otp, expiration: expiration }, { new: true });
            if (!data) {
                data = await GoogleUserData.findOneAndUpdate({ email: email }, { otp: otp, expiration: expiration }, { new: true });
            }
            console.log(data, 'from resend otp')
            return res.status(200).json({ message: 'OTP Resend successfully' });

        }
    });
})

router.post("/useremailotpverify", jwtAuthorization, async (req, res) => {
    console.log(req.user, "from req");

    try {
        let data;
        data = await userData.findOne({ _id: req.user.id });
        if (!data) {
            data = await GoogleUserData.findOne({ _id: req.user.id });
        }
        console.log(data, "from otp verify data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }

        console.log(data.otp, "from data", req.body.otp);
        let existingOtp;
        existingOtp = await userData.findOne({ otp: req.body.otp, expiration: { $gt: new Date() } });
        if (!existingOtp) {
            existingOtp = await GoogleUserData.findOne({ otp: req.body.otp, expiration: { $gt: new Date() } });
        }
        if (existingOtp) {
            res.status(200).send({ message: 'OTP verified successfully.' });
        } else {
            res.status(400).send({ message: 'Invalid or expired OTP.' });
        }


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post("/createnewpassword", jwtAuthorization, async (req, res) => {

    try {
        const { password } = req.body;
        console.log(password + "from input new password")
        let checked;
        try {
            checked = await userData.findOne({ _id: req.user.id })
            if (!checked) {
                checked = await GoogleUserData.findOne({ _id: req.user.id })

            }
            console.log(checked + "from db")
        } catch (err) {
            console.log(err)
        }
        if (!checked) {
            return res.status(400).send({ message: 'User Not Found' });
        }

        console.log(checked.email, 'checked.email')

        if (checked) {

            const saltRounds = 10;
            bcrypt.hash(req.body.password, saltRounds)
                .then(async hashedPassword => {
                    console.log('Hashed password:', hashedPassword);
                    let postData;
                    postData = await userData.findOneAndUpdate({ _id: req.user.id }, { password: hashedPassword }, { new: true })
                    if (!postData) {
                        postData = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, { password: hashedPassword }, { new: true })
                    }
                    if (!postData) {
                        return res.status(400).send({ message: 'Password Not Updated' });
                    }
                    return res.json({ postData })
                })
                .catch(err => {
                    console.error('Error hashing password:', err);
                    return res.status(400).send({ message: 'password encryption failed' });
                });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

router.get('/getuserprofiledata', jwtAuthorization, async (req, res) => {
    try {
        let data;
        data = await userData.findOne({ _id: req.user.id });
        if (!data) {
            data = await GoogleUserData.findOne({ _id: req.user.id });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }
        return res.json({ data })

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.put('/saveuserprofiledata', jwtAuthorization, async (req, res) => {
    const {
        userName,
        dateOfBirth,
        bio,
        disability,
        accessibilityNeeds,
        gender,
        phoneNumber,
        email,
        emergencyContact,
        address
    } = req.body;
    const updateData = {
        userName,
        dateOfBirth,
        bio,
        disability,
        accessibilityNeeds,
        gender,
        phoneNumber,
        email,
        emergencyContact,
        address
    };
    try {
        let data;
        data = await userData.findOneAndUpdate({ _id: req.user.id }, updateData, { new: true });
        if (!data) {
            data = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, updateData, { new: true });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }

        return res.json({ data })

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

// Upload image to S3 and store URL in MongoDB
router.post('/uploadprofileimage', upload.single('image'), jwtAuthorization, async (req, res) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
        };
        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        const updateData = {
            image: imageUrl
        }
        let data;
        data = await userData.findOneAndUpdate({ _id: req.user.id }, updateData, { new: true });
        if (!data) {
            data = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, updateData, { new: true });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }
        res.status(201).send({ imageUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading image');
    }
});
router.put('/saveuserpreferencedata', jwtAuthorization, async (req, res) => {
    const {
        currency,
        language,
        accessibilityNeeds
    } = req.body;
    const updateData = {
        currency,
        language,
        accessibilityNeeds
    };
    try {
        let data;
        data = await userData.findOneAndUpdate({ _id: req.user.id }, updateData, { new: true });
        if (!data) {
            data = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, updateData, { new: true });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }

        return res.json({ data })

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.put('/saveuserpaymentdata', jwtAuthorization, async (req, res) => {
    const {
        nameOnTheCard,
        cardNumber,
        expDate
    } = req.body;
    const updateData = {
        nameOnTheCard,
        cardNumber,
        expDate
    };
    try {
        let data;
        data = await userData.findOneAndUpdate({ _id: req.user.id }, { payments: updateData }, { new: true });
        if (!data) {
            data = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, { payments: updateData }, { new: true });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }

        return res.json({ data })

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.put('/changeuseremail', jwtAuthorization, async (req, res) => {
    const {
        email
    } = req.body;
    console.log(email, "from change email")
    try {
        let data;
        data = await userData.findOneAndUpdate({ _id: req.user.id }, { email }, { new: true });
        if (!data) {
            data = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, { email }, { new: true });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }
        return res.json({ data })
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.put('/changeuserpassword', jwtAuthorization, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        console.log(newPassword + "from input new password")
        let checked;
        try {
            checked = await userData.findOne({ _id: req.user.id })
            if (!checked) {
                checked = await GoogleUserData.findOne({ _id: req.user.id })

            }
            console.log(checked + "from db")
        } catch (err) {
            console.log(err)
        }
        if (!checked) {
            return res.status(400).send({ message: 'User Not Found' });
        }
        console.log(checked.email, 'checked.email')
        if (checked) {
            bcrypt.compare(currentPassword, checked.password, (err, success) => {
                if (err) {
                    // Handle error
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Server Error')

                } else {
                    console.log('Passwords match:', success);
                    if (success) {
                        const saltRounds = 10;
                        bcrypt.hash(req.body.newPassword, saltRounds)
                            .then(async hashedPassword => {
                                console.log('Hashed password:', hashedPassword);
                                let postData;
                                postData = await userData.findOneAndUpdate({ _id: req.user.id }, { password: hashedPassword }, { new: true })
                                if (!postData) {
                                    postData = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, { password: hashedPassword }, { new: true })
                                }
                                if (!postData) {
                                    return res.status(400).send({ message: 'Password Not Updated' });
                                }
                                return res.json({ success })
                            })
                            .catch(err => {
                                console.error('Error hashing password:', err);
                                return res.status(400).send({ message: 'password encryption failed' });
                            });

                    } else {
                        return res.status(400).send({ message: 'Wrong Password' });
                    }
                }
            });

        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.get('/setaccountinactive', jwtAuthorization, async (req, res) => {

    try {
        let data;
        data = await userData.findOneAndUpdate({ _id: req.user.id }, { isActive: false }, { new: true });
        if (!data) {
            data = await GoogleUserData.findOneAndUpdate({ _id: req.user.id }, { isActive: false }, { new: true });
        }
        console.log(data, "from db data");
        if (!data) {
            return res.status(400).send({ message: 'User Not found' });
        }
        return res.json({ data })
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.get('/getuserdata', async (req, res) => {
    try {
        const getUser = await userData.find({})
        console.log(getUser + "from db")

        return res.json(getUser)

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.get('/getgoogledata', jwtAuthorization, async (req, res) => {
    try {
        const getUser = await GoogleUserData.find({})
        console.log(getUser + "from db")

        return res.json(getUser)

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
})
router.delete('/deleteuserdata/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        let deletedUser;
        deletedUser = await userData.findByIdAndDelete(userId);
        if (!deletedUser) {
            deletedUser = await GoogleUserData.findByIdAndDelete(userId);

        }
        if (!deletedUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        console.log('Deleted user:', deletedUser);
        return res.json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send('Server Error');
    }
});




module.exports = router;