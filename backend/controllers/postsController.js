const Post = require("../models/Post");
const User = require("../models/User");



exports.CreatePost = async (req, res) => {
    try {
        const payload = req.body;
        let newPost = new Post(payload);
        await newPost.save((err, data) => {
            if (err) {
                return res.status(400).send({ message: 'Error while Posting.' })
            }
            res.status(200).send({ PostId: data._id, message: 'Post has been Saved successfully.' })
        })
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}


//Need to Update


exports.UpdatePost = async (req, res) => {
    try {
        const payload = req.body;
        Post.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, data) => {
            if (err) {
                return res.status(400).send({ message: "you can update only your post", err })
            }
            res.status(200).send({ employeeID: req.params.empID, message: 'the post has been updated' })
        })
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}


//Need to Update

exports.DeletePost = async (req, res) => {
    try {
        const deletePost = await Post.findById({ _id: req.params.id });
        if (deletePost) {
            Post.deleteOne({ _id: deletePost._id }, (err, data) => {
                if (err) {
                    return res.status(400).send({ message: "you can delete only your post", err });
                }
                res.status(200).send({ message: "the post has been deleted." })
            })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
};



exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id });
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).send({ Message: "The post has been liked" });
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).send({ message: "The post has been disliked" });
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
}




exports.GetPost = async (req, res) => {
    try {
        Post.findOne({ _id: req.params.id }, (err, data) => {
            if (err) {
                return res.status(400).send({ message: 'Error while retrieving an Data.' })
            }
            res.status(200).send(data);
        });
    } catch (error) {
        res.status(500).send(error, { message: 'Internal Server Error' });
    }
}



exports.TimelinePost = async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((id) => {
                return Post.find({ userId: id })
            }));
        res.status(200).send(userPosts.concat(...friendPosts), { message: 'Data Send' });
    } catch (error) {
        res.status(500).send(error, { message: 'Internal Server Error' });
    }
};