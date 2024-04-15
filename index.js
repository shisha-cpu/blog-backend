import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validation.js'
import checkAuth from './untils/checkAuth.js';
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import multer from 'multer'
import handleErrors from './untils/handleErrors.js';
import cors from 'cors'
import fs from 'fs';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB okey'))
    .catch((err) => console.log('db error', err))

const app = express()
app.use(cors())
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage })


app.use(express.json())

app.use('/uploads', express.static('uploads'))
app.get('/', (req, res) => {
    res.send('swqalam')
})
app.post('/posts/:id/comments', checkAuth, PostController.addCommentToPost);
app.get('/posts/:id/comments', PostController.getCommentsForPost);
app.get('/tags', PostController.getLastTags)
app.get('/posts/tags', PostController.getLastTags)
app.post('/auth/login', loginValidation, handleErrors, UserController.login)
app.post('/auth/register', registerValidation, handleErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/posts/tags', PostController.getLastTags)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Сервер запущен ');
})