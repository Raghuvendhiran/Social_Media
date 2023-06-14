const User = require("../models/User");
const bcrpyt = require('bcrypt');


exports.register = async (req, res) => {
    try {
        const payload = req.body;
        const hashValue = await bcrpyt.hash(payload.password, 10);
        payload.password = hashValue;
        let newUser = new User(payload);
        await newUser.save((err, data) => {
            if (err) {
                return res.status(400).send({ message: 'Error while employee registration.', err })
            }
            res.status(200).send({ UserId: data._id, message: 'User has been registered successfully.' })
        })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const exitingUser = await User.findOne({ email: email });
        if (exitingUser) {
            const isValidCredentials = await bcrpyt.compare(password, exitingUser.password);
            if (isValidCredentials) {
                return res.status(200).send({ message: 'Employee has been loggedin successfully.' });
            }
            return res.status(400).send({ message: 'wrong password' });
        }
        res.status(400).send({ message: "user not found" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
};

