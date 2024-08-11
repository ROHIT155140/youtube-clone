

import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({
    path: "./env"
})

const PORT = process.env.PORT || 5500

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port no ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Database Connection faild', err)
    })





