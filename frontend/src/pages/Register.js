import React from "react";
import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';

const createUser = async (credentials) => {
    return fetch('http://localhost:8000/api/users/', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(credentials)
    }).then((response) => response.json())
    .then((result) => {
        return result
    })
    .catch(error => { return error})
}

const Register = ({setToken, setReady}) => {

    const [inputs, setInputs] = useState({
        user_name: "",
        password: "",
        confirmPassword: ""
    });

    const [file, setFile] = useState('');
    function handleFileChange(e) {
        setFile(e.target.files[0]);
        console.log(file);
    }

    const handleInputChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        })); 
    }

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        // Verificar que las constraseñas coincidan
        if(inputs.password !== inputs.confirmPassword){
            console.log("Contraseñas invalidas")
            return
        }

        // Se va a verificar si el usuario es valido jaja
        const result = await createUser(inputs)
        if(result.user_name === undefined){
            console.log("Error con user ya exitente")
            return
        }
        setToken(result)
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
            <Box 
                display="flex" 
                flexDirection={"column"} 
                maxWidth={600} 
                alignItems ="center" 
                justifyContent={"center"} 
                margin="auto" 
                marginTop={10}
                padding={10}
                borderRadius={5}
                boxShadow={"5px 5px 10px  #ccc"}
                sx={{":hover": {boxShadow: "15px 15px 30px  #ccc"}}}
            >
                <Typography
                    variant="h3" 
                    padding={5} 
                    textAlign = "center"
                    color={'secondary.main'}
                    fontFamily={"Monospace"}
                >
                    Register
                </Typography>
                <TextField 
                    type={"text"} 
                    label="Username" 
                    name="user_name"
                    value={inputs.user_name}
                    onChange={handleInputChange}
                    variant="outlined" 
                    margin="normal"
                />
                <TextField 
                    type={"password"} 
                    label="Password" 
                    name="password"
                    value={inputs.password}
                    onChange={handleInputChange}
                    variant="outlined" 
                    margin="normal"
                />
                <TextField 
                    type={"password"} 
                    label="Confirm Password" 
                    name="confirmPassword"
                    value={inputs.confirmPassword}
                    onChange={handleInputChange}
                    variant="outlined" 
                    margin="normal"
                />
                <Button 
                    margin="normal"
                    component = "label"
                    sx={{":hover": {boxShadow: "7px 7px 15px  #bbb"}, margin: 1, borderRadius:2}}
                    onClick={handleFileChange}
                >
                    
                    <input 
                        type={"file"} 
                        
                    />
                </Button>
                <Button 
                    variant="contained" 
                    sx={{":hover": {boxShadow: "7px 7px 15px  #bbb"}, margin: 1, borderRadius:2}}
                    type="submit"
                    endIcon={<HowToRegIcon />}
                >
                    Registrate
                </Button>

                <Button 
                    sx={{":hover": {boxShadow: "7px 7px 15px  #bbb"}, marginTop: 3, borderRadius:2}}
                    onClick={() => setReady(0)}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </Button>

            </Box>
            </form>
        </div>
    ); 
};

export default Register;