import React from 'react'
import './Header.css'
import UpdateUser from '../UpdateUser'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Avatar, Chip, Button } from '@mui/material'

const Header = ({ user, setUser, setPage }) => {
    return (
        <div>
            <header>
                <a href="#" class="logo">
                    Twitortrix
                </a>

                <ButtonGroup
                    variant="contained"
                    aria-label="outlined primary button group"
                >
                    <Chip
                        avatar={<Avatar>{user.user_name.charAt(0)}</Avatar>}
                        label={user.user_name}
                    />
                    <Button
                        onClick={() => {
                            setPage('blog')
                        }}
                    >
                        Inicio
                    </Button>
                    <Button
                        onClick={() => {
                            setPage('explorar')
                        }}
                    >
                        Explorar
                    </Button>

                    <Button
                        onClick={() => {
                            setPage('UpdateUser')
                        }}
                    >
                        Editar usuario
                    </Button>

                    <Button
                        onClick={() => {
                            setPage('dashboard')
                        }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        onClick={() => {
                            setUser(null)
                        }}
                    >
                        Salir
                    </Button>
                </ButtonGroup>
            </header>
        </div>
    )
}

export default Header
