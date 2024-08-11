import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,// cloudinary url,
            required: [true, 'video url required']
        },
        thumbnail: {
            type: String,// cloudinary url,
            required: [true, 'thumbnail url required']
        },

        title: {
            type: String,
            required: [true, 'title is required']
        },

        description: {
            type: String,
            required: [true, 'description is required']
        },

        duration: {
            type: Number,// cloudinary url,
            required: true
        },

        views: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)