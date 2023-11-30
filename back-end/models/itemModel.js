const { Timestamp } = require('bson')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
}, { timestamps: true })


module.exports = mongoose.model('Item', itemSchema)