const User = require("../models/User");
const bcrpyt = require('bcrypt');


//Need to Updates


exports.UpdateUser = async (req, res) => {
    const payload = req.body;
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (payload.password) {
            try {
                const hashValue = await bcrpyt.hash(payload.password, 10);
                payload.password = hashValue;
            } catch (error) {
                res.status(500).send({ message: 'Internal Server Error' });
            }
        };
        try {
            User.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, data) => {
                if (err) {
                    return res.status(400).send({ message: "you can update only your post", err })
                }
                res.status(200).send({ employeeID: req.params.empID, message: 'Account has been updated' })
            })
        } catch (error) {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(403).send({ message: "you can update only your post", err })
    }
}


exports.DeleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete({_id:req.params.id});
            res.status(200).send({ message: "Account has been deleted" })
        } catch (error) {
            res.status(500).send(error, { message: 'Internal Server Error' })
        }
    }
    else {
        return res.status(403).send("You can delete only your account!");
    }
}


exports.GetUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }, (err, data) => {
            if (err) {
                return res.status(400).send({ message: 'Error while retrieving an Data.' })
            }
            const { password, updatedAt, ...other } = user._doc;
            res.status(200).send(other);
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
};


exports.FollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).send("user has been followed");
            } else {
                res.status(403).send("you allready follow this user");
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(403).send("you cant follow yourself");
    }
};

exports.UnfollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).send("user has been unfollowed");
            } else {
                res.status(403).send("you dont follow this user");
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(403).send("you cant unfollow yourself");
    }
};