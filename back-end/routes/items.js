const express = require('express')
const {
    getItems,
    getItem,
    createItem,
    deleteItems,
    deleteItem,
    updateItem
} = require('../controllers/itemController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all item routes
router.use(requireAuth)

// Get all items
router.get('/', getItems)

// Get single item
router.get('/:id', getItem)

// Post an item
router.post('/', createItem)

// Delete all items
router.delete('/', deleteItems)

// Delete an item
router.delete('/:id', deleteItem)

// Update an item
router.patch('/:id', updateItem)


module.exports = router