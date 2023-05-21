import express from "express";
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
    .connect('mongodb://REDACTED:REDACTED@REDACTED-HOST:REDACTED')
    .then(() => console.log('db ok'))
    .catch(err => console.log('err', err ))

const app = express();

app.use(express.json());
 
app.post('/login', loginValidation, UserController.login);
app.post('/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/posts', checkAuth, postCreateValidation,  PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.listen(8080, () => {
    console.log('server ok')
})