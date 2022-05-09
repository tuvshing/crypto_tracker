import { AppBar, Container, MenuItem, Toolbar, Typography, Select } from '@mui/material';
import { makeStyles, ThemeProvider } from '@mui/styles';
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { createTheme } from '@mui/material/styles';
import { CryptoState } from '../CoinContext';


const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: '#bd93f9',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
}))
const darkMode = createTheme({
  palette: {
    primary: {
      main: '#fff'
    },
    type: 'dark',
  },
})


const Header = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const {curr, setCurr } = CryptoState()
  return (
    <ThemeProvider theme={darkMode}>
    <AppBar color = 'transparent' position='static'>
      <Container> 
        <Toolbar>
          <Typography 
          onClick={() => navigate('/')} 
          className={classes.title}
          variant='h6'
          >
            Crypto Tracker
          </Typography>
          <Select
            variant='outlined'
            style={{
                width: 100,
                height:40,
                color: '#bd93f9',
                marginLeft: 15,
              }}
              value={curr}
              onChange={(c) => setCurr(c.target.value) }
              
              >  
            <MenuItem value={'USD'}>USD</MenuItem>
            <MenuItem value={'CAD'}>CAD</MenuItem>

          </Select>
        </Toolbar>
      </Container>  
    </AppBar>
    </ThemeProvider>
    )
  
};

export default Header