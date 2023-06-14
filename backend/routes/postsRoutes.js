const express = require('express');
const router = express.Router();

const { CreatePost, UpdatePost, DeletePost, likePost, GetPost, TimelinePost } = require('../controllers/postsController');


router.post('/', CreatePost);

router.put('/:id', UpdatePost);

router.delete('/:id', DeletePost);

router.put('/:id/like', likePost);

router.get('/:id', GetPost);

router.get('/timeline/all', TimelinePost);


module.exports = router;