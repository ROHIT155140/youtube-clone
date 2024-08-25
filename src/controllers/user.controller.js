import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'


const generateAccessTokenAndRefreshToken = async (userId) => {

    const user = await User.findOne(userId)

    const accsssToken = user.genrateAccessToken()
    const refreshToken = user.genrateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accsssToken, refreshToken }

}


const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body;

    // empty fields validation

    if (
        [fullName, email, username, password].some((fields) => (
            fields?.trim() === ""
        ))
    ) {
        throw new ApiError(400, 'All Fields are required')
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, 'user with email or username is already exist')
    }

    //get files from req with the help of multer
    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {

    // req.body -> data
    // check username,email,password
    // user existance or not
    //password matching if matching 
    // login base username or email
    //  send secoure cookies -> accesssToken and refreshtoken get

    const { username, email, password } = req.body;

    if (!email || !username) {
        throw new ApiError(400, "username and email are required")
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        throw new ApiError(404, "user does not exist!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user crediantials")
    }

    const { accsssToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findOne(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accsssToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(200,
            {
                user: loggedInUser, accsssToken, refreshToken

            },
            "User Logged In Successfully"
        )
})

export { registerUser, loginUser } 