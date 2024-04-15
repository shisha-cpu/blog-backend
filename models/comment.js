// models/comment.js

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        ref: 'Post',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;