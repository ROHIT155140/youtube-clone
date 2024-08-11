import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    {
        username: {
            tpye: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            tpye: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            tpye: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,// cloudinary url
            required: true,
        },

        coverImage: {
            type: String,// cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'password is required']
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true })


export const User = mongoose.model('User', userSchema)