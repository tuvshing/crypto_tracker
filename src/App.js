import { makeStyles } from "@mui/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Alert from "./components/Alert";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";

const useStyles = makeStyles({
  App: {
    // backgroundColor: '#20222A',
    backgroundColor: "#181a1e",
    color: "white",
    minHeight: "100vh",
  },
});
function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          {/* <Route path='/coins/:id' element={< />} /> */}
        </Routes>
      </div>
      <Alert/>
    </BrowserRouter>
  );
}

export default App;
