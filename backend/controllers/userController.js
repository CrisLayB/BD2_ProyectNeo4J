const sessionNeo4J = require('../config/db')
const asyncHandler = require('express-async-handler')
const md5 = require('md5')

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
        return res.status(400).json({error: 'User not find'})        
    }

    const user = {
        user_name: result.records[0].get('user_name'),
        bio: result.records[0].get('bio')
    }

    res.status(200).json(user)
})


// @desc   Create new user
// @route  POST /api/users
// @access Public
const createUser = asyncHandler(async (req, res) => {
    const { user_name, password, bio, sex, age } = req.body

    // Verify if data exist
    if (!user_name || !password) {
        return res.status(400).json({error: 'Please add all the fields'})
    }

    // Checking if user exits in the database
    const countUser = await sessionNeo4J.run(`
        MATCH (u:User {user_name: '${user_name}'})
        RETURN COUNT(u) AS count
    `)

    if (countUser.records[0].get('count').toNumber() === 1) {
        return res.status(400).json({error: 'The username is invalid'})
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

    const result = await sessionNeo4J.run(`
        MATCH (u:User {user_name: '${user_name}'})
        RETURN u
    `)

    const user_result = result.records.map(i=>i.get('u').properties)

    if(user_result.length === 0){
        return res.status(400).json({error: 'Invalid username/password'})
    }

    const user = user_result[0] // Obtener el primer y único registro que existe
    
    if (user && (await md5(password)) === user.password) {
        return res.json({
            _id: user._id,
            user_name: user.user_name,
            bio: user.bio
        })
    }
    
    res.status(400).json({error: 'Invalid username/password'})
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { user_name, bio } = req.body;
    
    const result = await sessionNeo4J.run(`
        MATCH (u:User {_id: '${req.params.id}'}) 
        SET u.user_name = '${user_name}', 
            u.bio = '${bio}' 
        RETURN u
    `)
  
    if (result.records.length === 0) {
        return res.status(404).json({ error: 'User not found' })
    }

    const updatedUser = result.records[0].get('u').properties
    
    res.json({
        _id: updatedUser._id,
        user_name: updatedUser.user_name,
        bio: updatedUser.bio
    })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const result = await sessionNeo4J.run(`
        MATCH (u:User {_id: '${req.params.id}'}) 
        DELETE u
    `)

    if (result.summary.counters.nodesDeleted === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).json({ messsge: 'Usuario borrado' })
})

// @desc   Follow an User
// @route  POST /api/users/follow
// @access Public
const followUser = asyncHandler(async(req, res) => {
    const { id_user, id_user_to_follow } = req.body

    // Verify if data exist
    if (!id_user || !id_user_to_follow) {
        return res.status(400).json({error: 'Please add all the fields'})
    }

    // Verify if the id the are don't the same
    if (id_user === id_user_to_follow){
        return res.status(400).json({error: 'Is not allowed the same id'})
    }

    const query = `
        MATCH (u1:User {_id: '${id_user}'}), (u2:User {_id: '${id_user_to_follow}'})
        MERGE (u1)-[:FOLLOW]->(u2)    
    `

    // Run query
    sessionNeo4J.run(query)
        .then(result => {
            res.status(200).json({ message: 'Follow relationship created' });
        })
        .catch(error => {
            console.error('Error creating follow relationship:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
})

module.exports = {
    findAllUsers,
    getUser,
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    followUser
}