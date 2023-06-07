// import { Router } from "express"
// import userController from "../controllers/userController"

// const user = Router()

const express = require('express')
const router = express.Router()

const {
    findAllUsers,
    getUser,
    createUser,
    loginUser,
    updateUser,
    deleteUser
} = require('../controllers/userController')

// Define Routers for User
router.get('/', findAllUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.post('/login/', loginUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router