import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CryptoList } from '../apiconf/api'
import { CryptoState } from '../CoinContext'
import { createTheme } from '@mui/material/styles'
import { Container, tableCellClasses, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/styles';
import ChartInfo from './ChartInfo'
import { setSelectionRange } from '@testing-library/user-event/dist/utils'



const darkMode = createTheme({
    palette: {
      primary: {
        main: '#fff'
      },
      type: 'dark'
    }
  })
// const useStyles = makeStyles(() => ({
//     row: {
//         backgroundColor: "#282a36",
//         cursor: 'pointer',
//         '&:hover': {
//             backgroundColor:'#44475a'
//         },
//         fontFamily: 'Open Sans',
//     },
//     ul: {
//         "& .MuiPaginationItem-root": {
//           color: "#bd93f9",
//           '&.Mui-selected': {
//             background: '#44475a',
//           },
//         },
//       }
// }))

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

function currencyRounder (labelValue) {
    const temp = Math.abs(Number(labelValue))
    //Billion
    return temp >= 1.0e+9
    ? (temp / 1.0e+9).toFixed(2) + "B"
    //Million
    : temp >= 1.0e+6
    ? (temp / 1.0e+6).toFixed(2) + "M"
    //Thousand
    : temp >= 1.0e+3
    ? (temp / 1.0e+3).toFixed(2) + "K"
    : temp;
}

const CoinList = () => {
    const [cryptos, setCryptos] = useState([])
    const [load, setLoad] = useState(false)
    const {curr, symbol} = CryptoState()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const navigate = useNavigate()

    const [coin, setCoin] = useState('bitcoin')



    // Fetch crypto data from api
    useEffect(() => {
        const fetch = async () => {
            setLoad(true)
            const {data} = await axios.get(CryptoList(curr))
            setCryptos(data)
            setLoad(false)
        }
        fetch()
    }, [curr])

    // Search bar handler
    const handleSearch = () => {
        return cryptos.filter((c) => (
            c.name.toLowerCase().includes(search) ||
            c.symbol.toLowerCase().includes(search)
        ))
    }

    return <ThemeProvider theme = {darkMode}>
    <Grid container>
        <Grid item xs={1}/>
            <Grid item xs={10} style={{ display: "flex", gap: "1rem" }}>
            <Container style = {{textAlign: 'center'}} >
                <Typography
                    variant = 'h4'
                    style={{color: '#bd93f9', margin:18, fontFamily:'Open Sans'}}>
                    Cryptocurrency by Market Cap
                </Typography>
                <TextField 
                    style={{
                    backgroundColor: "#282a36",
                    marginBottom:20, 
                    width:'100%'}}
                    sx={{borderRadius: 15,
                        "& .MuiInput-underline:before": {
                            borderBottom: "2px solid white"
                            },
                        input:{color: '#bd93f9'}}}
                    InputLabelProps={{style: { color: 'white' }}}
                    label='Search for a crypto currency...'
                    variant='outlined' 
                    onChange={(c) => setSearch(c.target.value)}
                />
                <TableContainer style={{ borderRadius: 15}}>
                    {load? (<LinearProgress style ={{backgroundColor: '#bd93f9'}}></LinearProgress>) : 
                        (<Table aria-label="table" sx={{
                            [`& .${tableCellClasses.root}`]: {borderBottom: "none"} }}>
                            <TableHead style ={{backgroundColor: '#44475a'}}>
                                <TableRow>
                                    {['Coin', 'Price', '24h Change', 'Market Cap'].map((head) =>(
                                        <TableCell style = {{
                                            color: '#bd93f9',
                                            fontWeight: '700',
                                            fontFamily: 'Open Sans'}}
                                        key={head}
                                        align={head === 'Coin' ? '': 'right'}
                                        >
                                        {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {handleSearch().slice((page - 1) * 20, (page - 1) * 20 + 20).map((row) => {
                                    const p = row.price_change_percentage_24h > 0
                                    return (
                                        <TableRow 
                                        onClick={() => 
                                        setCoin(row.id)
                                        // navigate(`/coins/${row.id}`)

                                        }
                                        // className={classes.row}
                                        sx={{
                                            backgroundColor: "#282a36",
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor:'#44475a'
                                            },
                                            fontFamily: 'Open Sans',
                                        }}
                                        key={row.name}>
                                            <TableCell 
                                            component='th'
                                            scope='row'
                                            styles={{
                                                display:'flex',
                                                gap: 15,
                                            }}>
                                            <img 
                                            src = {row?.image}
                                            alt = {row.name}
                                            height = '20'
                                            style = {{marginBottom: -2, marginRight: 6}}
                                            />
                                            {/* <div style={{display:'flex', flexDirection: 'column'}}> */}
                                                <span style = {{color:'white',textTransform: 'uppercase', fontSize: 20,  marginRight: 10}}>
                                                {row.symbol}
                                                </span>
                                                <span style = {{color:'darkgray'}}>
                                                {row.name}
                                                </span>
                                            {/* </div> */}
                                            </TableCell>
                                            <TableCell align = 'right'
                                            style ={{color:'white',
                                            fontWeight: 700,}}>
                                            {symbol}{'$'}
                                            {/* {numberWithCommas(row.current_price.toFixed(2))} */}
                                            {row.current_price > 0.01 ? numberWithCommas(row.current_price.toFixed(2)) : Number(row.current_price.toPrecision(4))}
                                            </TableCell>
                                            <TableCell align = 'right'
                                            // determine if change is + or -
                                            style ={{
                                                color: p > 0 ? '#74F471' : '#F47174',
                                                fontWeight: 700,
                                                }}>
                                            {p && '+'}
                                            {row.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                            <TableCell align = 'right'
                                            style = {{color: 'white',
                                            fontWeight: 700,}}>
                                            {symbol}{"$"}
                                            {currencyRounder((row.market_cap))}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>)
                    }
                </TableContainer>
                <Pagination
                    count={(handleSearch()?.length / 20).toFixed(0)}
                    style={{
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    }}
                //   classes={{ul: classes.ul}}
                    sx={{
                        "& .MuiPaginationItem-root": {
                    color: "#bd93f9",
                    '&.Mui-selected': { background: '#44475a'},
                    }}}
                    onChange={(_, val) => {
                        setPage(val);
                        window.scroll(0, 0);
                    }}
                />

            </Container>
            
            
            <Container style={{margin:'60pt 0px', backgroundColor:'#282a36', borderRadius:15, maxHeight:590, width:'100%', height:'100%',}}>
                <ChartInfo coin={coin}/>
            </Container>
            </Grid>
        <Grid item />
    </Grid>
    </ThemeProvider>
}

export default CoinList
