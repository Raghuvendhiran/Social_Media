const express = require('express');
const router = express.Router();


const { UpdateUser, DeleteUser, GetUser, FollowUser, UnfollowUser } = require('../controllers/userController');


router.put('/:id', UpdateUser);

router.delete('/:id', DeleteUser);

router.get('/:id', GetUser);

router.put('/:id/follow', FollowUser);

router.put('/:id/unfollow', UnfollowUser);


module.exports = router;