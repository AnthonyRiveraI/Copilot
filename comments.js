// Create web server 

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');

// GET all comments
router.get('/', (req, res, next) => {
    Comment.find()
        .exec()
        .then(docs => {
            console.log(docs);
            // if (docs.length >= 0) {
            res.status(200).json(docs);
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

// GET comment by id
router.get('/:commentId', (req, res, next) => {
    const id = req.params.commentId;
    Comment.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            // if (doc) {
            res.status(200).json(doc);
            // } else {
            //     res.status(404).json({ message: 'No valid entry found for provided ID' });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// POST a comment
router.post('/', (req, res, next) => {
    // Check if post exists
    Post.findById(req.body.postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }
            const comment = new Comment({
                _id: new mongoose.Types.ObjectId(),
                postId: req.body.postId,
                email: req.body.email,
                content: req.body.content,
                date: req.body.date
            });
            return comment.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Comment stored',
                createdComment: {
                    _id: result._id,
                    postId: result.postId,
                    email: result.email,
                    content: result.content,
                    date: result.date
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/comments/' + result._id
                }
            });