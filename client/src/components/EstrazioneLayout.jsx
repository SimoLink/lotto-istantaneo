import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Estrazione from './Estrazione';
import { Container } from 'react-bootstrap';
import FormScommessa from './FormScommessa';
import { useEffect, useState } from 'react';
import { Routes, Route, Outlet} from "react-router-dom";
import MessaggioNotifica from './MessaggioNotifica';
import API from '../API.mjs';


const idUtente = (Math.floor(Math.random() * 5) + 1).toString();
  console.log(idUtente);

function EstrazioneLayout() {
  const [estrazioneCorrente, setEstrazioneCorrente] = useState([]);
  const [tempoRimanente, setTempoRimanente] = useState(0);
  const [idUltimaEstrazione, setIdUltimaEstrazione] = useState(0);

  useEffect(() => {
    // Recupera l'ultima estrazione
    const getEstrazione = async () => {
      const estrazione = await API.getEstrazione();
      const estrazioneCorrente = estrazione.estrazione;
      const tempoRimanente = estrazione.tempoRimanente + 1;
      setEstrazioneCorrente(estrazioneCorrente);
      setTempoRimanente(tempoRimanente);
      setIdUltimaEstrazione(estrazione.idUltimaEstrazione);
    };
    getEstrazione();
  }, [tempoRimanente]);


  const test = () => {
    setTempoRimanente(0);
  };

  

  

  
  
  return (
    <Container fluid className='mt-3'>
      <Estrazione test={test} estrazioneCorrente={estrazioneCorrente} tempoRimanente={tempoRimanente}/>
      {/*!controlloPuntata ? <FormScommessa idUltimaEstrazione={idUltimaEstrazione} nascondiForm={nascondiForm} /> : "hai già giocato"*/}
      {/*notificaVincita >= 0 && <MessaggioNotifica notificaVincita={notificaVincita} cancellaNotifica={cancellaNotifica} />*/}
      <FormScommessa idUtente={idUtente} idUltimaEstrazione={idUltimaEstrazione}/> 
<MessaggioNotifica idUtente={idUtente} idUltimaEstrazione={idUltimaEstrazione} />
    </Container>
  );
}

export default EstrazioneLayout;
