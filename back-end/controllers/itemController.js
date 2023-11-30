const Item = require('../models/itemModel')
const mongoose = require('mongoose')

// Get all items
const getItems = async (req, res) => {
    const user_id = req.user._id
    const item = await Item.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(item)
}

// Get single item
const getItem = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such item'})
    }
    
    const item = await Item.findById(id)

    if (!item) {
        return res.status(404).json({error: 'No such item'})
    }

    res.status(200).json(item)
}

// Post an item
const createItem = async (req, res) => {
    const { quantity, itemName, amount } = req.body
    let emptyFields = []

    if (!quantity) {
        emptyFields.push('quantity')
    }
    if (!itemName) {
        emptyFields.push('itemName')
    }
    if (!amount) {
        emptyFields.push('amount')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }

    try {
        const user_id = req.user._id
        const item = await Item.create({quantity, itemName, amount, user_id})
        res.status(200).json(item)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete all items
const deleteItems = async (req, res) => {
    const item = await Item.deleteMany({})

    res.status(200).json(item)
}

// Delete an item
const deleteItem = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such item'})
    }

    const item = await Item.findOneAndDelete({_id: id})

    if (!item) {
        return res.status(404).json({error: 'No such item'})
    }

    res.status(200).json(item)
}

// Update an item
const updateItem = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such item'})
    }

    const item = await Item.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!item) {
        return res.status(404).json({error: 'No such item'})
    }

    res.status(200).json(item)
}

module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItems,
    deleteItem,
    updateItem
}