import { makeStyles } from "@mui/styles";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css';
import Coinpage from "./components/Coinpage";
import Header from "./components/Header";
import Homepage from "./pages/Homepage"


const useStyles = makeStyles({
  App: {
    backgroundColor: '#282a36',
    color: 'white',
    minHeight: '100vh',
  }
})
function App() {
  const classes = useStyles();
  return (
    <BrowserRouter > 
      <div className={classes.App} >
        <Header />
        <Routes>  
          <Route path='/' element={<Homepage/>} exact />
          <Route path='/coins/:id' element={<Coinpage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
