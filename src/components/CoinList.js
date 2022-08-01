import React, { useEffect, useState } from "react";
import axios from "axios";
import { CryptoList } from "../config/api";
import { CryptoState } from "../CoinContext";
import { createTheme } from "@mui/material/styles";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import IconButton from '@mui/material/IconButton';

import {
  Container,
  tableCellClasses,
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import ChartInfo from "./ChartInfo";
import PieChart from "./PieChart";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const darkMode = createTheme({
  palette: {
    container: "#202528",
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const numberWithCommas = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function currencyRounder(labelValue) {
  const temp = Math.abs(Number(labelValue));
  //Billion
  return temp >= 1.0e9
    ? (temp / 1.0e9).toFixed(2) + "B"
    : //Million
    temp >= 1.0e6
    ? (temp / 1.0e6).toFixed(2) + "M"
    : //Thousand
    temp >= 1.0e3
    ? (temp / 1.0e3).toFixed(2) + "K"
    : temp;
}

const CoinList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [load, setLoad] = useState(false);
  const { curr, symbol, user, watchlist, setAlert } = CryptoState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [coin, setCoin] = useState("bitcoin");
  const inWatchlist = watchlist.includes(coin)
  // Fetch crypto data from api
  useEffect(() => {
    const fetch = async () => {
      setLoad(true);
      const { data } = await axios.get(CryptoList(curr));
      setCryptos(data);
      setLoad(false);
    };
    fetch();
  }, [curr]);

  // Search bar handler
  const handleSearch = () => {
    return cryptos.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.symbol.toLowerCase().includes(search)
    );
  };

  const top20names = handleSearch()
    .slice(0, 8)
    .map((row) => row.id);
  const top20mcap = handleSearch()
    .slice(0, 8)
    .map((row) => row.market_cap);
  // console.log(coin)
  const addToWatchlist = async () => {
    const coinRef = doc(db, 'watchlist', user.uid)

    try{
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin] : [coin]
      })
      
      setAlert({
        open: true,
        message: `${coin} added to the Watchlist!`,
        type: 'success',
      })
    } catch(error) {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      })
    }
  }

  return (
    <ThemeProvider theme={darkMode}>
      <Grid container>
        <Grid item xs={6}>
          {/* <Grid item xs={10} ys={12} style={{ display: "flex", gap: "1rem" }}> */}
          <Container style={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              style={{ color: "white", margin: 18, fontFamily: "Open Sans" }}
            >
              Cryptocurrency by Market Cap
            </Typography>
            <TextField
              style={{
                backgroundColor: "#282a36",
                marginBottom: 20,
                width: "100%",
              }}
              sx={{
                borderRadius: 15,
                "& .MuiInput-underline:before": {
                  borderBottom: "2px solid white",
                },
                input: { color: "#bd93f9" },
              }}
              InputLabelProps={{ style: { color: "white" } }}
              label="Search for a crypto currency..."
              variant="outlined"
              onChange={(c) => setSearch(c.target.value)}
            />
            <TableContainer style={{ borderRadius: 15 }}>
              {load ? (
                <LinearProgress
                  style={{ backgroundColor: "#bd93f9" }}
                ></LinearProgress>
              ) : (
                <Table
                  aria-label="table"
                  sx={{
                    [`& .${tableCellClasses.root}`]: { borderBottom: "none" },
                  }}
                >
                  <TableHead style={{ backgroundColor: "#44475a" }}>
                    <TableRow>
                      {["Coin", "Price", "24h Change", "Market Cap", "Watchlist"].map(
                        (head) => (
                          <TableCell
                            style={{
                              color: "#bd93f9",
                              fontWeight: "700",
                              fontFamily: "Open Sans",
                            }}
                            key={head}
                            align={head === "Coin" ? "" : "right"}
                          >
                            {head}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {handleSearch()
                      .slice((page - 1) * 20, (page - 1) * 20 + 20)
                      .map((row) => {
                        const p = row.price_change_percentage_24h > 0;
                        return (
                          <TableRow
                            onClick={() => setCoin(row.id)}
                            selected={coin === row.id}
                            sx={{
                              backgroundColor: darkMode.palette.container,
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "#44475a",
                              },
                              fontFamily: "Open Sans",
                              "&.Mui-selected, &.Mui-selected:hover": {
                                backgroundColor: "#44475a",
                              },
                            }}
                            key={row.name}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              styles={{
                                display: "flex",
                                gap: 15,
                              }}
                            >
                              <img
                                src={row?.image}
                                alt={row.name}
                                height="20"
                                style={{ marginBottom: -2, marginRight: 6 }}
                              />
                              {/* <div style={{display:'flex', flexDirection: 'column'}}> */}
                              <span
                                style={{
                                  color: "white",
                                  textTransform: "uppercase",
                                  fontSize: 20,
                                  marginRight: 10,
                                }}
                              >
                                {row.symbol}
                              </span>
                              <span style={{ color: "darkgray" }}>
                                {row.name}
                              </span>
                              {/* </div> */}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ color: "white", fontWeight: 700 }}
                            >
                              {symbol}
                              {"$"}

                              {row.current_price > 0.01
                                ? numberWithCommas(row.current_price.toFixed(2))
                                : Number(row.current_price.toPrecision(4))}
                            </TableCell>
                            <TableCell
                              align="right"
                              // determine if change is + or -
                              style={{
                                color: p > 0 ? "#74F471" : "#F47174",
                                fontWeight: 700,
                              }}
                            >
                              {p && "+"}
                              {row.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ color: "white", fontWeight: 700 }}
                            >
                              {symbol}
                              {"$"}
                              {currencyRounder(row.market_cap)}
                            </TableCell>

                            <TableCell
                              align="right"
                            >
                              <IconButton 
                                aria-label="watchlist" 
                                sx={{color:'white'}} 
                                onClick={addToWatchlist}>
                                <StarOutlineIcon/>
                                {/* {inWatchlist? <StarOutlinedIcon/> : <StarOutlineIcon/>} */}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
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
                  "&.Mui-selected": { background: "#44475a" },
                },
              }}
              onChange={(_, val) => {
                setPage(val);
                window.scroll(0, 0);
              }}
            />
          </Container>

          {/* <Container style={{margin:'60pt 0px', backgroundColor:'#282a36', borderRadius:15, maxHeight:590, width:'100%', height:'100%',}}>
                        <ChartInfo coin={coin}/>
                    </Container> */}
          {/* <Container style={{margin:'60pt 0px', backgroundColor:'#282a36', borderRadius:15, maxHeight:590, width:'100%', height:'100%',}}>
                        <PieChart/> 
                    </Container> */}
          {/* </Grid> */}
        </Grid>

        <Grid item xs={6}>
          <Container
            style={{
              margin: "60pt 0px",
              backgroundColor: darkMode.palette.container,
              borderRadius: 15,
              maxHeight: 590,
              width: "100%",
              height: "100%",
            }}
          >
            <ChartInfo coin={coin} />
          </Container>

          <Grid item xs={6}>
            {/* <Container style={{margin:'60pt 0px', backgroundColor:darkMode.palette.container, borderRadius:15, maxHeight:590, width:'100%', height:'100%',}}> */}
            <PieChart topNames={top20names} topMcap={top20mcap} />
            {/* </Container> */}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default CoinList;
