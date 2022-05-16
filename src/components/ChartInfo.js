import { CircularProgress, createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/styles'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { HistoricalChart } from '../apiconf/api'
import { CryptoState } from '../CoinContext'
import { chartDays } from "../apiconf/days";
import DayButton from './DayButton'

import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    } from 'chart.js';

    Chart.register(
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
    const [flag,setflag] = useState(false);    
    const {curr} = CryptoState()
    useEffect(() => {
        const fetchHistoricData = async () => {
            const { data } = await axios.get(HistoricalChart(coin, days, curr.toLowerCase()));
            setflag(true);
            setHist(data.prices);
        };
    fetchHistoricData();
    }, [coin, curr, days]);
    return ( 
    // <ThemeProvider theme={darkTheme}>
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
                id='line'
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
                            // borderColor: '#bd93f9',
                            backgroundColor: '#bd93f9',
                            borderColor: 'rgba(118,106,192,1)',
                            borderJoinStyle:'round',
                            borderCapStyle:'round',
                            borderWidth:3,
                            pointRadius:0,
                            pointHitRadius:10,
                            lineTension:.2,
                        }]
                }}
                options={{
                    // elements: {
                    // point: {
                    //     radius: 1,
                    // }},
                    scales: {
                        x: {
                            grid: {
                            display: false,
                            },
                            gridLines: {},
                            ticks: {
                            color: "white",
                            }
                        },
                        y: {
                            grid: {
                            display: false,
                            },
                            gridLines: {},
                            ticks: {
                            color: "white",
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
                        datalabels: {
                            color: 'white'
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
    // </ThemeProvider>
    )

}

export default ChartInfo