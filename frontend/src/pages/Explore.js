import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'
import Post from './components/Post'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const querieGet = async user_id => {
    return fetch(`http://localhost:8000/api/posts/posts-user/${user_id}`)
        .then(response => response.json())
        .then(result => {
            return result
        })
}
const queriePost = async (url, querie) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(querie),
    })
        .then(response => response.json())
        .then(result => {
            return result
        })
        .catch(error => {
            return error
        })
}

const Explore = ({ user }) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [date, setDate] = useState('')

    const handleKeyword = async event => {
        if (event) {
            event.preventDefault()
        }

        const result = await queriePost(
            'http://localhost:8000/api/posts/keyword',
            { keyword: search }
        )
        setPosts(result)
    }

    const handleDate = async event => {
        if (event) {
            event.preventDefault()
        }

        const formatDate = date.format('YYYY-MM-DD')
        const result = await queriePost(
            'http://localhost:8000/api/posts/date',
            { date: formatDate }
        )
        setPosts(result)
    }

    const handleUserPosts = async event => {
        if (event) {
            event.preventDefault()
        }

        const result = await querieGet(user._id)
        setPosts(result)
    }

    return (
        <div>
            <div id="poster">
                <form>
                    <Box
                        display="flex"
                        flexDirection={'column'}
                        maxWidth="45%"
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
                            label="Buscar por titulo, descripcion o tag"
                            type={'text'}
                            name="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            multiline
                            maxRows={2}
                            variant="filled"
                        />
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                                handleKeyword()
                            }}
                        >
                            Buscar
                        </Button>
                        <br></br>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Ingrese fecha..."
                                views={['year', 'month', 'day']}
                                value={date}
                                onChange={newValue => {
                                    setDate(newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} />
                                )}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            size="medium"
                            onClick={() => {
                                handleDate()
                            }}
                        >
                            Buscar
                        </Button>
                        <br></br>

                        <Button
                            color="secondary"
                            onClick={() => {
                                handleUserPosts()
                            }}
                        >
                            Mis posts
                        </Button>
                    </Box>
                </form>
            </div>

            <div>
                {posts.map(post => (
                    <Post post={post} />
                ))}
            </div>
        </div>
    )
}

export default Explore
