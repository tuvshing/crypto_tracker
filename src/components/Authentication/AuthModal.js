import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from '@mui/lab';
import Login from './Login';
import SignUp from './SignUp';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { CryptoState } from '../../CoinContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#202528',
  color: 'white',
  borderRadius: 2,
  borderBottom: 1, 
  borderColor: 'divider'
};
// border: '2px solid #000',
// boxShadow: 24,
// p: 4,
export default function AuthModal() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [value, setValue] = React.useState(0)
  const {setAlert} = CryptoState()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const googleProvider = new GoogleAuthProvider()

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(res => {
      setAlert({
        open: true,
        message: `Sign Up Successful! Welcome ${res.user.email}`,
        type: 'success',
      })
      handleClose()
    }).catch(error => {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      })
    })
  }

  return (
    <div>
      <Button variant='contained'style={{backgroundColor:'#bd93f9' }}onClick={handleOpen}>Login</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div>
            <Box sx={style}>
                <Tabs value={value} onChange={handleChange} variant='fullWidth' style={{borderRadius: 10}}>
                <Tab label="Login" sx={{color:'white'}} />
                <Tab label="Sign Up" sx={{color:'white'}}/>
                </Tabs>
                {value===0 && <Login handleClose={handleClose} />}
                {value===1 && <SignUp handleClose={handleClose} />}
                <Box sx={{    
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  gap: 3,
                  fontSize: 20
                  }}>
                  <span>OR</span>
                  <GoogleButton
                    style={{width:'100%', outline:'none'}}
                    onClick={signInWithGoogle}
                  >
                  </GoogleButton>
            </Box>
            </Box>

          </div>
        </Fade>
      </Modal>
    </div>
  )
}
