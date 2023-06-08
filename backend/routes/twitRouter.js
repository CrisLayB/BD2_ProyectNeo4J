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
router.post('/action/like', likedTwit)
router.post('/action/comment', commentTwit)

module.exports = router
