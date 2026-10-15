import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    avatarUrl: String,
    avatarData: {
        type: Buffer,
        select: false
    },
    avatarContentType: {
        type: String,
        select: false
    },
	isAdmin: Boolean,
	movieShareToken: String,
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);