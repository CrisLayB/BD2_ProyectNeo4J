import React from "react";
import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";


const update_user = async (credentials, user) => {
    return fetch('http://localhost:8000/api/users/real-info/' + user._id, {
        method:'PUT',
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

const UpdateUser = ({setToken, user}) => {

    const [inputs, setInputs] = useState({
        name: "",
        lastname: "",
        email: ""
    });

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

        const result = await update_user(inputs, user)
        if(result._id === undefined){
            console.log("Error") // Quiero detectar el bad request jaja
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
                maxWidth={1000} 
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
                    Update your profile
                </Typography>
                
                <TextField 
                    type={"text"} 
                    name="name"
                    value={inputs.name}
                    onChange={handleInputChange}
                    label="First Name" 
                    variant="outlined" 
                    margin="normal"
                />
                
                <TextField 
                    type={"text"} 
                    name="lastname"
                    value={inputs.lastname}
                    onChange={handleInputChange}
                    label="Last Name" 
                    variant="outlined" 
                    margin="normal"
                />  

                <TextField 
                    type={"text"} 
                    name="email"
                    value={inputs.email}
                    onChange={handleInputChange}
                    label="Email" 
                    variant="outlined" 
                    margin="normal"
                />
                
                <Button 
                    type="submit"
                    variant="contained" 
                    sx={{":hover": {boxShadow: "7px 7px 15px  #bbb"}, margin: 1, borderRadius:2}}
                    
                >
                    Modificar Datos
                </Button>


            </Box>
            </form>
        </div>
    ); 
};

export default UpdateUser;