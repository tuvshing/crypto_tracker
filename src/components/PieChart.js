import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
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
} from "chart.js";
import { getGlobalData } from "../config/api";
import { CryptoState } from "../CoinContext";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  createTheme,
  Divider,
} from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";

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

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  chartContainer: {
    marginTop: theme.spacing(3),
    position: "relative",
    height: "542px",
  },
}));
const darkMode = createTheme({
  palette: {
    container: "#202528",
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const PieChart = ({ topNames, topMcap }) => {
  const [globalCap, setGlobalCap] = useState({
    data: { total_market_cap: {} },
  });
  const { curr } = CryptoState();
  const classes = useStyles();
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(getGlobalData(curr));
      setGlobalCap(data);
    };
    fetch();
  }, [curr]);
  const marketCap = globalCap["data"]["total_market_cap"][curr.toLowerCase()];
  const sum = topMcap.reduce((psum, a) => psum + a, 0);
  const other = marketCap - sum;
  // console.log(marketCap);
  const pieObjects = new Set(topNames);
  pieObjects.add("other");
  const pieMarketCaps = new Set(topMcap);
  pieMarketCaps.add(other);
  return (
    <Card
      className={classes.root}
      sx={{ backgroundColor: darkMode.palette.container, borderRadius: 5 }}
    >
      <CardHeader
        title="Global Market Cap Chart"
        sx={{ color: "white", textAlign: "center" }}
      />
      <Divider sx={{ background: "#bd93f9" }} />
      <CardContent>
        <div className={classes.chartContainer}>
          <Doughnut
            data={{
              labels: Array.from(pieObjects),
              datasets: [
                {
                  label: "Market Cap",
                  backgroundColor: [
                    "#f2a900",
                    "#8c8c8c",
                    "#26a17b",
                    "#2775ca",
                    "#f3ba2f",
                    "#00aae4",
                    "#3cc8c8",
                    "#dc1fff",
                    "#FFB6C1",
                  ],
                  data: Array.from(pieMarketCaps),
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "right",
                  align: "center",
                  labels: {
                    color: "white",
                    padding: 20,
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChart;
