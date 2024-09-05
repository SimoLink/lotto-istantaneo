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
  const [idUltimaEstrazione, setIdUltimaEstrazione] = useState(0);
  const [controlloPuntata, setControlloPuntata] = useState(false);
  const [notificaVincita, setNotificaVincita] = useState(-1);

  /*const aggiungiPuntata = (newPuntata) => {
    setPuntata(oldPuntata => {return oldPuntata.concat(newPuntata)});
  }*/
  
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
      setIdUltimaEstrazione(estrazione.idUltimaEstrazione);
    }
    getEstrazione();
    console.log("test3")

  }, [tempoRimanente]);

  const test = () => {
    setTempoRimanente(0);
  }

  useEffect(() => {
    const controlloPuntata = async () => {
      try {
        const idUtente = "2";
        const response = await API.controlloPuntata(idUtente, idUltimaEstrazione);
        setControlloPuntata(response);
      } catch (error) {
        console.error("Errore durante il controllo della puntata:", error);
      }
    };
    controlloPuntata();
    console.log("test2")

  }, [idUltimaEstrazione]);

  useEffect(() => {
    //recupera le notifiche
    const notificaVincita = async () => {
      const notifica = await API.notificaVincita(2);
      setNotificaVincita(notifica);
    }
    notificaVincita();
    console.log("test1")
  }, [idUltimaEstrazione]);

  const cancellaNotifica = (idUtente) => {
    API.notificaLetta(idUtente);
    setNotificaVincita(-1); // Nasconde la notifica impostando a -1
  };

  const nascondiForm = () => {
    setControlloPuntata(true);
  };
  
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
        <Estrazione test={test} estrazioneCorrente={estrazioneCorrente} tempoRimanente={tempoRimanente} budget={fakeBudget}></Estrazione>
        {/*<FormScommessa aggiungiPuntata={aggiungiPuntata}></FormScommessa>*/}
        {!controlloPuntata ? <FormScommessa idUltimaEstrazione={idUltimaEstrazione} nascondiForm={nascondiForm}></FormScommessa> : "hai già giocato"}
        {/*notificaVincita === 0 ? "hai perso" : 
        notificaVincita > 0 ? "hai vinto" + notificaVincita + "punti" : ""*/}
        {notificaVincita >= 0 && <MessaggioNotifica notificaVincita={notificaVincita} cancellaNotifica={cancellaNotifica}></MessaggioNotifica>}
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