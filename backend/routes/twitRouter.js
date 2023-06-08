const express = require('express')
const router = express.Router()

const {
    showRecenTwits,
    getTwit,
    createNewTwit,
    likedTwit,
    commentTwit
} = require('../controllers/twitController')

router.get('/', showRecenTwits)
router.get('/:id', getTwit)
router.post('/:id', createNewTwit)
router.post('/like/', likedTwit)
router.post('/comment/', commentTwit)

module.exports = router
