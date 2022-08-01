import { Box, Button, Snackbar, TextField } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { CryptoState } from '../../CoinContext'
import { auth } from '../../firebase'


const SignUp = ({handleClose}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { setAlert } = CryptoState()

    const handleSubmit = async () => {
        if ( password !== confirmPassword) {
            setAlert({
                open:true,
                message:'Password Verification Failed',
                type:'error'
            })
            return
        }
        
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            setAlert({
                open:true,
                message:`Sign Up Successful! Welcome ${result.user.email}`,
                type:'success'
            })
            handleClose()
        } catch(error) {
            setAlert({
                open:true,
                message:error.message,
                type:'error'
            })
        }
    }


  return (
    <Box
        p={3}
        style={{display:'flex', flexDirection:'column', gap:'20px'}}
    >
        <TextField
            variant='outlined'
            type='email'
            label='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "white" } }}
            style={{
                backgroundColor: "#282a36",
                width: "100%",
            }}
            sx={{
                borderRadius: 3,
                "& .MuiInput-underline:before": {
                    borderBottom: "2px solid white",
                },
                input: { color: "white" },
            }}
        />
        <TextField
            variant='outlined'
            type='password'
            label='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "white" } }}
            style={{
                backgroundColor: "#282a36",
                width: "100%",
            }}
            sx={{
                borderRadius: 3,
                "& .MuiInput-underline:before": {
                    borderBottom: "2px solid white",
                },
                input: { color: "white" },
            }}
        />
        <TextField
            variant='outlined'
            type='password'
            label='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "white" } }}
            style={{
                backgroundColor: "#282a36",
                width: "100%",
            }}
            sx={{
                borderRadius: 3,
                "& .MuiInput-underline:before": {
                    borderBottom: "2px solid white",
                },
                input: { color: "white" },
            }}
        />
        <Button
            variant='contained'
            size='large'
            style = {{backgroundColor:'#bd93f9'}}
            onClick={handleSubmit}
        >
            Sign Up
        </Button>

    </Box>
  )
}

export default SignUp