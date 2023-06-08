import React, { useEffect, useState } from 'react'
import { Box, TextField, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const addComment = async (post_id, user_comment) => {
    return fetch(`http://localhost:8000/api/posts/new-comment/${post_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(user_comment),
        withCredentials: true,
        crossorigin: true,
        mode: 'cors',
    })
        .then((response) => response.json())
        .then((result) => {
            return result
        })
        .catch((error) => {
            return error
        })
}

const Post = ({ user_connected, post }) => {
    const [comment, setComment] = useState('')

    const handleNewComment = async (event) => {
        if (event) {
            event.preventDefault()
        }

        if (/^\s*$/.test(comment)) {
            alert('Porfavor escriba algo')
            return
        }

        // alert(user_connected.user_name)
        const result = addComment(post._id, {
            user_comment: {
                user_name: user_connected.user_name,
                comment: comment,
            },
        })

        console.log(result)
        if (result.acknowledged === false) {
            alert('Ocurrio un error :(')
        }
        setComment('')
    }

    return (
        <div>
            <Box
                display="flex"
                flexDirection={'column'}
                maxWidth={600}
                alignItems="center"
                justifyContent={'center'}
                margin="auto"
                marginTop={10}
                padding={10}
                borderRadius={5}
                boxShadow={'5px 5px 10px  #ccc'}
                sx={{ ':hover': { boxShadow: '15px 15px 30px  #ccc' } }}
            >
                <h4>{post.date}</h4>
                <h3>{post.user_name}</h3>
                <h2>{post.title}</h2>
                <p>{post.content}</p>

                {/* <br></br>
                {post.tags.length !== 0 && <h3>Tags{':'}</h3>}
                {post.tags.map((tag) => (
                    <p>{tag}</p>
                ))}
                <br></br> */}

                <TextField
                    id="outlined-multiline-static"
                    label="Comenta"
                    type={'text'}
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    multiline
                    rows={1}
                    defaultValue=" "
                    fullWidth
                    padding="2"
                />
                <br></br>

                {/* handleNewComment */}
                <Button
                    variant="outlined"
                    endIcon={<SendIcon />}
                    onClick={() => {
                        handleNewComment()
                    }}
                >
                    Comentar
                </Button>

                {/* <br></br>
                {post.comments.length !== 0 && <h3>Comentarios{':'}</h3>}
                <br></br>
                {post.comments.map((comment) => (
                    <div>
                        <h5>{comment.user_name}</h5>
                        <p>{comment.comment}</p>
                        <br></br>
                    </div>
                ))} */}
            </Box>
        </div>
    )
}

export default Post
