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
    avatarUrl: String,
	isAdmin: Boolean,
	movieShareToken: String,
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);