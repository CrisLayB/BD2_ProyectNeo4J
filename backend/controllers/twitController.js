const sessionNeo4J = require('../config/db')
const asyncHandler = require('express-async-handler')

// @desc    Get Twits in order by date
// @route   GET /api/twits/
// @access  Public
const showRecenTwits = asyncHandler(async (req, res) => {
    const result = await sessionNeo4J.run(`
        MATCH (u:User)-[p:POSTED]->(t:Twit)
        RETURN u, p, t
        ORDER BY t.date DESC
    `)

    res.status(200).json(result.records.map(record => {
        const user = record.get('u').properties
        const twit = record.get('t').properties

        const date = twit.date
        const dateFormated = `${date.year}-${date.month}-${date.day} TIME: ${date.hour}:${date.minute}`
        
        const showTwit = {
            _id: twit._id,
            user_name: user.user_name,
            title: twit.title,
            content: twit.content,
            date: dateFormated
        }

        return showTwit
    }))
})

// @desc    Get Specific Twit with all the escential
// @route   GET /api/twits/:id
// @access  Public
const getTwit = asyncHandler(async (req, res) => {
    // Show all the information of the twit
    // Show the name of the user that public the twit
    // Show all the amount of likes
    // Show all the amount of comments and his content
})

// @desc   Create new Tiwt
// @route  POST /api/twits/:id
// @access Public
const createNewTwit = asyncHandler(async (req, res) => {
    const date = new Date()
    const dateString = date.toISOString()
    const {title, content} = req.body
    
    if(!title){
        return res.status(400).json({error: 'Title not defined'})        
    }
    
    const query = `
        MERGE(t:Twit {_id: apoc.create.uuid(), title: "${title}", content: "${content}", date: datetime("${dateString}")})
        WITH t
        MATCH (u:User {_id: '${req.params.id}'})
        MERGE (u)-[:POSTED]->(t)
    `
    
    sessionNeo4J.run(query)
        .then(result => {
            res.status(200).json({ message: 'Twit created' });
        })
        .catch(error => {
            console.error('Error creating new Twit:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
})

// @desc   Create relation "like" for User and Twit
// @route  POST /api/twits/action/like/
// @access Public
const likedTwit = asyncHandler(async (req, res) => {
    const { id_user, id_twit } = req.body

    if(!id_user || !id_twit){
        return res.status(400).json({error: 'Please add all the id of user and id of content'})
    }

    const query = `
        MATCH (u:User {_id: "${id_user}"}), (t:Twit {_id: '${id_twit}'})
        MERGE (u)-[:LIKES]->(t)
    `

    const notificationQuery = `
        MATCH (liker:User {_id: "${id_user}"}), (twit:Twit {_id: "${id_twit}"}), (owner:User)-[:POSTED]->(twit)
        MERGE (notification:Notification {_id: apoc.create.uuid(), content: liker.user_name + " le dio like a tu publicacion", checked: false})
        WITH notification
        MERGE (notification)-[:NOTIFIED_TO]->(owner)
        RETURN notification
    `

    // Run query
    sessionNeo4J.run(query)
        .then(() => {
            return sessionNeo4J.run(notificationQuery);
        })
        .then(result => {
            res.status(200).json({ message: 'Twit Like' });
        })
        .catch(error => {
            console.error('Error creating like and notification:', error);
            res.status(500).json({ error: 'An error occurred' });
        })
})

// @desc   Create relation "comment" for User and Twit
// @route  POST /api/twits/action/comment/
// @access Public
const commentTwit = asyncHandler(async (req, res) => {
    const { id_user, id_twit, content } = req.body

    if(!id_user || !id_twit){
        return res.status(400).json({error: 'Please add all the id of user and id of content'})
    }
    
    if(!content){
        return res.status(400).json({error: 'Please add content for the commetn'})
    }
    
    const date = new Date()
    const dateString = date.toISOString()

    const query = `
        MATCH (u:User {_id: "${id_user}"}), (t:Twit {_id: '${id_twit}'})
        MERGE (u)-[c:COMMENTS]->(t)
        SET c.date = datetime("${dateString}")
        SET c.content = "${content}"
    `

    const notificationQuery = `
        MATCH (liker:User {_id: "${id_user}"}), (twit:Twit {_id: "${id_twit}"}), (owner:User)-[:POSTED]->(twit)
        MERGE (notification:Notification {_id: apoc.create.uuid(), content: liker.user_name + " comento tu publicacion", checked: false})
        WITH notification
        MERGE (notification)-[:NOTIFIED_TO]->(owner)
        RETURN notification
    `

    // Run query
    sessionNeo4J.run(query)
        .then(() => {
            return sessionNeo4J.run(notificationQuery);
        })
        .then(result => {
            res.status(200).json({ message: 'Twit Commented' });
        })
        .catch(error => {
            console.error('Error creating comment and notification:', error);
            res.status(500).json({ error: 'An error occurred' });
        })
})

module.exports = {
    showRecenTwits,
    getTwit,
    createNewTwit,
    likedTwit,
    commentTwit
}