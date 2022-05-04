import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CryptoList } from '../apiconf/api'
import { CryptoState } from '../CoinContext'
import { createTheme } from '@mui/material/styles'
import { Container, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { makeStyles, ThemeProvider } from '@mui/styles';


const darkMode = createTheme({
    palette: {
      primary: {
        main: '#fff'
      },
      type: 'dark',
    },
  })
const useStyles = makeStyles(() => ({}))

const CoinList = () => {
    const [cryptos, setCryptos] = useState([])
    const [load, setLoad] = useState(false)
    const {curr} = CryptoState()
    const [search, setSearch] = useState()
    const navigate = useNavigate()
    const classes = useStyles()
    const fetch = async () => {
        setLoad(true)
        const {data} = await axios.get(CryptoList(curr))
        setCryptos(data)
        setLoad(false)
    }

    console.log(cryptos)
    useEffect(() => {
        fetch()
    }, [curr])

    const handleSearch = () => {
        return cryptos.filter((c) => (

            c.name.toLowerCase().includes(search) ||
            c.symbol.toLowerCase().includes(search)
        ))
    }





  return <ThemeProvider theme ={darkMode}>
      <Container style = {{textAlign: 'center'}}>
        <Typography
            variant = 'h4'
            style={{margin:18, fontFamily:'Open Sans'}}>
            Cryptocurrency by Market Cap
        </Typography>
        <TextField 
            label='Search for a crypto currency..'
            variant='outlined'
            style={{marginBottom:20, width:'100%'}}  
            onChange={(c) => setSearch(c.target.value)}
        />


        <TableContainer>
            {load? (<LinearProgress style ={{backgroundColor: '#bd93f9'}}></LinearProgress>) : 
                (<Table>
                    <TableHead style ={{backgroundColor: '#bd93f9'}} >
                        <TableRow>
                            {['Coin', 'Price', '24h Change', 'Market Cap'].map((head) =>(
                                <TableCell style = {{
                                    color: 'black',
                                    fontWeight: '700',
                                    fontFamily: 'Open Sans'
                                }}
                                key={head}
                                align={head === 'Coin' ? '': 'right'}
                                >
                                    {head}
                                </TableCell>
                            ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {handleSearch().map((row) => {
                            const p = row.price_chaneg_percentage_24h > 0
                            return (
                                <TableRow 
                                onClick={() => navigate('/coins/${row.id}')}
                                className={classes.row}
                                key={row.name}>
                                    <TableCell 
                                    component='th'
                                    scope='row'
                                    styles={{
                                        display:'flex',
                                        gap: 15,
                                    }}>
                                    <img 
                                    src ={row?.image}
                                    alt={row.name}
                                    height='20'
                                    style={{marginBottom: -2, marginRight: 6}}
                                    />
                                    {/* <div style={{display:'flex', flexDirection: 'column'}}> */}
                                        <span style ={{color:'white',textTransform: 'uppercase', fontSize: 22,  marginRight: 10}}>
                                        {row.symbol}
                                        </span>
                                        <span style ={{color:'darkgray'}}>
                                            {row.name}
                                        </span>
                                    {/* </div> */}
                                    </TableCell>

                                </TableRow>
                            )
                        })}

                        
                    </TableBody>

                </Table>
                )
            }
        </TableContainer>

      </Container>
  </ThemeProvider>
}

export default CoinList