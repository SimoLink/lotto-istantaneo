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

const fakeEstrazione = {
  id: 53,
  numero1: 20,
  numero2: 21,
  numero3: 22,
  numero4: 23,
  numero5: 24
}

  /*const classifica = [
    { username: 'topolino', punti: 150 },
    { username: 'paperino', punti: 140 },
    { username: 'pippo', punti: 130 }
  ];*/

const fakeBudget = 80;

function App() {
  const [classifica, setClassifica] = useState([]);
  const [puntata, setPuntata] = useState([]);
  const [estrazioneCorrente, setEstrazioneCorrente] = useState([]);
  const [tempoRimanente, setTempoRimanente] = useState(0);
  const aggiungiPuntata = (newPuntata) => {
    setPuntata(oldPuntata => {return oldPuntata.concat(newPuntata)});
  }
  
  useEffect(() => {
    //recupera i 3 migliori giocatori
    const getClassifica = async () => {
      const classifica = await API.getClassifica();
      setClassifica(classifica);
    }
    getClassifica();
  }, []);

  useEffect(() => {
    //recupera l'ultima estrazione
    const getEstrazione = async () => {
      const estrazione = await API.getEstrazione();
      const estrazioneCorrente = estrazione.estrazione;
      const tempoRimanente = estrazione.tempoRimanente;
      setEstrazioneCorrente(estrazioneCorrente);
      setTempoRimanente(tempoRimanente);
    }
    getEstrazione();
  }, [estrazioneCorrente]);
  
  return (
    <Routes>
      <Route element={
      <>
      <NavHeader ></NavHeader>
      <Outlet/>
      </>
      } >
      <Route path="/" element={
        <Container fluid className='mt-3'>
        <Estrazione estrazioneCorrente={estrazioneCorrente} tempoRimanente={tempoRimanente} budget={fakeBudget}></Estrazione>
        <FormScommessa aggiungiPuntata={aggiungiPuntata}></FormScommessa>
      </Container>
      }/>
      <Route path="/classifica" element={
        <TabellaClassifica classifica={classifica}></TabellaClassifica>
      }/>
      <Route path="*" element={
        <NotFound></NotFound>
      }/>
      </Route>
    </Routes>
  )
}

export default App