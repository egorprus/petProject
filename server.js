import express from "express";
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { PostController, UserController } from "./controllers/index.js";

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://REDACTED:REDACTED@REDACTED-HOST:REDACTED')
    .then(() => console.log('db ok'))
    .catch(err => console.log('err', err ))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename:(_, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage })

app.use(express.json());
app.use(cors());
 
app.post('/login', handleValidationErrors, UserController.login);
app.post('/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/upload', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: `uploads/${req.file.originalname}`
    })
})
app.listen(process.env.PORT || 8080, () => {
    console.log('server ok')
})