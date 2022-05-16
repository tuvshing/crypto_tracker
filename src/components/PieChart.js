import React from 'react'
import { Line, Pie } from 'react-chartjs-2'
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
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

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

const PieChart = () => {
  return (
    <div>
        <><Pie data = {{
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [2478,5267,734,784,433]
        }]
    }}
    // options = {{
    //     title: {
    //         display: true,
    //         text: 'Predicted world population (millions) in 2050'
    //       }
    // }}
    /></>
  </div>)
}

export default PieChart