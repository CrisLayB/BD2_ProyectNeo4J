import React, { useState, useEffect } from 'react'
import './Blog.css'
// Import Componentes
import Post from './components/Post'
import { Box, TextField, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NavigationIcon from '@mui/icons-material/Navigation'

const createPost = async (id, data) => {
    return fetch(`http://localhost:8000/api/twits/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
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

const Blog = ({ user }) => {
    const [posts, setPosts] = useState(null)
    const [newPost, setNewPost] = useState({
        user_name_id: user._id,
        title: '',
        content: '',
    })
    const [tag, setTag] = useState([])
    const [tags, setTags] = useState([])

    const handleNewPostChange = (e) => {
        setNewPost((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(() => {
        fetch('http://localhost:8000/api/twits/')
            .then((response) => response.json())
            .then((result) => setPosts(result))
    })

    const handleSubmitPost = async (event) => {
        if (event) {
            event.preventDefault()
        }
        const result = await createPost(user._id, {
            title: newPost.title,
            content: newPost.content,
        })
        console.log(result)
        if (!result.message) {
            alert('No se creo el post' + result.error)
            return
        }
        setNewPost({
            user_name_id: user._id,
            title: '',
            content: '',
        })
        setTags([])
    }

    return (
        <div>
            <div id="poster">
                <form onSubmit={handleSubmitPost}>
                    <Box
                        display="flex"
                        flexDirection={'column'}
                        maxWidth="45%"
                        alignItems="center"
                        justifyContent={'center'}
                        margin="auto"
                        marginTop={10}
                        padding={10}
                        borderRadius={5}
                        boxShadow={'5px 5px 10px  #ccc'}
                        sx={{
                            height: '25%',
                            backgroundColor: 'white',
                            padding: 2,
                            borderStyle: 'inset',
                            borderColor: '#344b8a',
                        }}
                    >
                        <TextField
                            id="filled-multiline-flexible"
                            type={'text'}
                            name="title"
                            value={newPost.title}
                            onChange={handleNewPostChange}
                            label="Titulo"
                            multiline
                            maxRows={2}
                            variant="filled"
                        />

                        <br></br>

                        <TextField
                            id="outlined-multiline-static"
                            type={'text'}
                            name="content"
                            value={newPost.content}
                            onChange={handleNewPostChange}
                            label="Dinos que piensas..."
                            multiline
                            rows={6}
                            defaultValue=" "
                            fullWidth
                        />

                        {tags.length !== 0 && <h3>Tags{':'}</h3>}
                        {tags.map((tag) => (
                            <p>{tag}</p>
                        ))}

                        <TextField
                            id="filled-multiline-flexible"
                            type={'text'}
                            name="content"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            label="Añade tus tags"
                            multiline
                            maxRows={1}
                            variant="filled"
                        />

                        <Fab color="primary" aria-label="add">
                            <AddIcon
                                onClick={() => {
                                    if (/^\s*$/.test(tag)) {
                                        alert('El tag esta vacio')
                                        return
                                    }
                                    const newTag = tag
                                    setTags((tags) => [...tags, newTag])
                                    setTag('')
                                }}
                            />
                        </Fab>
                        <br></br>
                        <Fab
                            type="submit"
                            variant="extended"
                            size="small"
                            color="primary"
                            aria-label="add"
                        >
                            <NavigationIcon sx={{ mr: 1 }} />
                            postear!
                        </Fab>
                    </Box>
                </form>
            </div>

            <div>
                {posts != null &&
                    posts.map((post) => (
                        <Post user_connected={user} post={post} />
                    ))}
            </div>
        </div>
    )
}

export default Blog
