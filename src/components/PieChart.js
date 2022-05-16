import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    } from 'chart.js';
import { getGlobalData } from '../apiconf/api';
import { CryptoState } from '../CoinContext';
import axios from 'axios';

    Chart.register(
    CategoryScale,
    ArcElement,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    );

const PieChart = ({topNames, topMcap}) => {
  const [globalCap, setGlobalCap] = useState({'data':{'total_market_cap':{}}})
  const {curr} = CryptoState()
  useEffect(() => {
    const fetch = async () => {
        const {data} = await axios.get(getGlobalData(curr))
        setGlobalCap(data)
    }
    fetch()
  }, [curr])
  const marketCap = globalCap['data']['total_market_cap'][curr.toLowerCase()]
  const sum = topMcap.reduce((psum, a) => psum + a, 0)
  const other = marketCap - sum
  console.log(marketCap)
  const pieObjects = new Set(topNames)
  pieObjects.add('other')
  const pieMarketCaps = new Set(topMcap)
  pieMarketCaps.add(other)

  return (
    <div>
        <><Pie data = {{
        labels: Array.from(pieObjects),
        datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#f2a900", "#8c8c8c","#26a17b","#2775ca","#f3ba2f","#00aae4","#3cc8c8","#dc1fff", "#FFB6C1"],
            data: Array.from(pieMarketCaps)
        }]
    }}
    options = {{
        title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
    }}
    /></>
  </div>)
}

export default PieChart