const sessionNeo4J = require('../config/db')
const asyncHandler = require('express-async-handler')
const md5 = require('md5')

// const findAllUsers = asyncHandler(async (req, res) => {
//     const result = await sessionNeo4J.run(`Match (u:User) return u`)
//     res.status(200).json(result.records.map(i=>i.get('u').properties))
// })

// @desc    Get All Existing users (Only user_name and bio)
// @route   GET /api/users
// @access  Public
const findAllUsers = asyncHandler(async (req, res) => {
    const result = await sessionNeo4J.run(`MATCH (u:User) RETURN u.user_name AS user_name, u.bio AS bio`)
    res.status(200).json(result.records.map(record => ({
        user_name: record.get('user_name'),
        bio: record.get('bio')
    })))
})

// @desc    Get An Specific User
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
    const result = await sessionNeo4J.run(`
        MATCH (u:User {_id: '${req.params.id}'}) 
        RETURN u.user_name AS user_name, u.bio AS bio
    `)

    if (result.records.length === 0) {
        res.status(400).json({error_message: 'User not find'})
    }

    const user = {
        user_name: result.records[0].get('user_name'),
        bio: result.records[0].get('bio')
    }

    res.status(200).json(user)
})


// @desc   Create new user
// @route  POST /api/users/create
// @access Public
const createUser = asyncHandler(async (req, res) => {
    const { user_name, password, bio, sex, age } = req.body

    // Verify if data exist
    if (!user_name || !password) {
        res.status(400).json({error_message: 'Please add all the fields'})
    }

    // Checking if user exits in the database
    const countUser = await sessionNeo4J.run(`
        MATCH (u:User {user_name: '${user_name}'})
        RETURN COUNT(u) AS count
    `)

    if (countUser.records[0].get('count').toNumber() === 1) {
        res.status(400).json({error_message: 'The username is invalid'})
        return
    }

    // Encryt Password
    const encryptedPassword = md5(password)

    // Create User
    const result = await sessionNeo4J.run(`
        CREATE (u:User {_id: apoc.create.uuid(), user_name: '${user_name}', password: '${encryptedPassword}', bio: '${bio}'})
        RETURN u._id AS _id, u.user_name AS user_name, u.bio AS bio
    `)

    // When the User is create returns the important data
    const user = {
        _id: result.records[0].get('_id'),
        user_name: result.records[0].get('user_name'),
        bio: result.records[0].get('bio')
    }
    
    res.status(201).json(user) // Return new user
})

// @desc   Authenticate a user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { user_name, password } = req.body

    // const user = await User.findOne({ user_name })
    // if (user && (await md5(password)) === user.password) {
    //     res.json({
    //         _id: user.id,
    //         user_name: user.user_name,
    //         posts: user.posts,
    //         profile_img: user.profile_img,
    //     })
    // } else {
    //     res.status(400).json({error_message: ''})
    // }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400).json({error_message: ''})
    }

    // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    // })

    // res.status(200).json({
    //     _id: updatedUser.id,
    //     user_name: updatedUser.user_name,
    //     real_info: updateUser.real_info,
    //     sex: updateUser.sex,
    //     birthday: updateUser.birthday,
    // })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    // const user = await User.findById(req.params.id)

    // if (!user) {
    //     res.status(400).json({error_message: ''})
    // }

    // await user.remove()

    res.status(200).json({ messsge: 'Usuario borrado' })
})

module.exports = {
    findAllUsers,
    getUser,
    createUser,
    loginUser,
    updateUser,
    deleteUser
}