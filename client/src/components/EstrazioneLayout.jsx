import 'bootstrap/dist/css/bootstrap.min.css';
import Estrazione from './Estrazione';
import { Container } from 'react-bootstrap';
import FormScommessa from './FormScommessa';
import { useEffect, useState } from 'react';
import MessaggioNotifica from './MessaggioNotifica';
import API from '../API.mjs';

function EstrazioneLayout(props) {
  const [estrazioneCorrente, setEstrazioneCorrente] = useState([]);
  const [tempoRimanente, setTempoRimanente] = useState(0);
  const [idUltimaEstrazione, setIdUltimaEstrazione] = useState(0);
  const [flag, setFlag] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    // Recupera l'ultima estrazione
    const getEstrazione = async () => {
      const estrazione = await API.getEstrazione();
      const estrazioneCorrente = estrazione.estrazione;
      const tempoRimanente = estrazione.tempoRimanente + 1;
      setEstrazioneCorrente(estrazioneCorrente);
      setTempoRimanente(tempoRimanente);
      setIdUltimaEstrazione(estrazione.idUltimaEstrazione);
      setWaiting(true);
    };
    getEstrazione();
  }, [flag]);


  const reset = () => {
    setTempoRimanente(0);
    setFlag(!flag);
  };

  return (
    waiting ? (
    <Container fluid className='mt-3'>
      <Estrazione reset={reset} idUltimaEstrazione={idUltimaEstrazione} estrazioneCorrente={estrazioneCorrente} tempoRimanente={tempoRimanente}/>
      <FormScommessa idUtente={props.user.id} idUltimaEstrazione={idUltimaEstrazione}/> 
      <MessaggioNotifica idUtente={props.user.id} idUltimaEstrazione={idUltimaEstrazione} />
    </Container>
    ) : (
    <Container>
      <p className='lead text-center fs-1'>Pagina in caricamento, attendere...</p>
    </Container>)
  );
}

export default EstrazioneLayout;
