require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const itemsRoutes = require('./routes/items')
const userRoutes = require('./routes/user')
const cors = require('cors')

// express app
const app = express()

app.use(cors())

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/items', itemsRoutes)
app.use('/api/user', userRoutes)

// coonect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for request
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening in port', process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error);
    })


// // connect to db using async/await

// async function connectDB() {
//     try{
//         await mongoose.connect(process.env.MONGO_URI)

//         // listen for request
//         app.listen(process.env.PORT, () => {
//             console.log('connected to db & listening in port', process.env.PORT);
//         })
//     } catch(error) {
//         console.log(error);
//     }
// }

// connectDB()