import { CircularProgress, createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/styles'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { CryptoByID, HistoricalChart } from '../apiconf/api'
import { CryptoState } from '../CoinContext'
import { chartDays } from "../apiconf/days";
import DayButton from './DayButton'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    } from 'chart.js';
    
    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    );
const capitalize = s => s && s[0].toUpperCase() + s.slice(1)


const ChartInfo = ({coin}) => {
    const [hist, setHist] = useState()
    const [days, setDays] = useState(30)

    const {curr} = CryptoState()

    const [flag,setflag] = useState(false);
    // console.log(crypto.id)

    const fetchHistoricData = async () => {
        const { data } = await axios.get(HistoricalChart(coin, days, curr.toLowerCase()));
        setflag(true);
        setHist(data.prices);
    };

    useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coin, curr, days]);

    const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
          },
          type: "dark",
        },
      });
    
    return ( <ThemeProvider theme={darkTheme}>
        <div>
        {
        !hist | flag === false ? (
            <CircularProgress style ={{color: '#bd93f9'}}
            size={250}
            thickness={1}
            />
        ) : (
            <>
            <Line
            
                data={{labels:hist.map(crypto => {
                    let date = new Date(crypto[0]);
                    let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                    
                }),
                    datasets: [
                        {
                            data: hist.map((crypto) => crypto[1]),
                            label: `Price of ${capitalize(coin)} in ${curr} ( Past ${days} Days) `,
                            borderColor: '#bd93f9',
                        }]
                }}
                options={{
                    elements: {
                    point: {
                        radius: 1,
                    }},
                    scales: {
                        x: {
                            grid: {
                            display: false
                            }
                        },
                        y: {
                            grid: {
                            display: false
                            }
                        }
                    },
                    plugins: {  // 'legend' now within object 'plugins {}'
                        legend: {
                            labels: {
                                color: "White",  // not 'fontColor:' anymore
                                // fontSize: 18  // not 'fontSize:' anymore
                                font: {
                                    size: 15 // 'size' now within object 'font {}'
                                },
                                padding:20
                            }
                        },
                    },
                }}
                />
                <div style={{display:'flex', marginTop:20, justifyContent:'space-around', width:'100%'}}>
                    {chartDays.map((day) => (
                        <DayButton
                        key={day.value}
                        onClick={() => {
                            setDays(day.value)
                            setflag(true)
                            }}
                        selected = {day.value === days}
                        >
                        {day.label}
                        </DayButton>
                    ))}
                </div>
            </>
            )}
             </div>
    </ThemeProvider>
    )

}

export default ChartInfo