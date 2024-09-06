import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavHeader from './components/NavHeader';
import Estrazione from './components/Estrazione';
import { Container } from 'react-bootstrap';
import FormScommessa from './components/FormScommessa';
import { useEffect, useState } from 'react';
import { Routes, Route, Outlet} from "react-router-dom";
import NotFound from './components/NotFound';
import TabellaClassifica from './components/TabellaClassifica';
import API from './API.mjs';
import MessaggioNotifica from './components/MessaggioNotifica';
import EstrazioneLayout from './components/EstrazioneLayout';

/*const fakeEstrazione = {
  id: 53,
  numero1: 20,
  numero2: 21,
  numero3: 22,
  numero4: 23,
  numero5: 24
}*/

  /*const classifica = [
    { username: 'topolino', punti: 150 },
    { username: 'paperino', punti: 140 },
    { username: 'pippo', punti: 130 }
  ];*/

//const fakeBudget = 80;

function App() {
  const [puntata, setPuntata] = useState([]);
  
  
  return (
    <Routes>
      <Route element={
      <>
      <NavHeader ></NavHeader>
      <Outlet/>
      </>
      } >
      <Route path="/homepage" element={
        <EstrazioneLayout></EstrazioneLayout>
      }/>
      <Route path="/classifica" element={
        <TabellaClassifica></TabellaClassifica>
      }/>
      <Route path="*" element={
        <NotFound></NotFound>
      }/>
      </Route>
    </Routes>
  )
}

export default App