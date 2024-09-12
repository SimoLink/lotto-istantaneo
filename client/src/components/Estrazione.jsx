import { Row, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function Estrazione(props) {
  return (
    <>
      <Row>
        <h2>Ultima estrazione: </h2>
      </Row>
      <Row>
        <Table responsive striped bordered>
          <tbody>
            <tr style={{ fontSize: '2em', textAlign: 'center' }}>
              <td>{props.estrazioneCorrente[0]}</td>
              <td>{props.estrazioneCorrente[1]}</td>
              <td>{props.estrazioneCorrente[2]}</td>
              <td>{props.estrazioneCorrente[3]}</td>
              <td>{props.estrazioneCorrente[4]}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row>
          <h2>Prossima estrazione tra: <ContoRovescia tempoRimanente={props.tempoRimanente} reset={props.reset} /></h2>
      </Row>
    </>
  );
}

function ContoRovescia(props) {
  const [tempoRimanente, setTempoRimanente] = useState(props.tempoRimanente);

  useEffect(() => {
    // Aggiorna il tempoRimanente quando cambia props.tempoRimanente
    setTempoRimanente(props.tempoRimanente);
  }, [props.tempoRimanente]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRimanente((tempo) => {
        if (tempo > 0) {
          return tempo - 1;
        } else {
          clearInterval(timer); // Ferma il timer quando il tempo finisce
          tempoScaduto(); // Chiama la funzione quando il tempo è scaduto
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Pulizia dell'intervallo quando il componente viene smontato
  }, [tempoRimanente]);

  const tempoScaduto = () => {
    setTimeout(() => { // Questo timeout permette di eseguire il reset del tempo dopo che il rendering di Estrazione è completato
      props.reset(); // Questo resetterà tempoRimanente dal componente genitore
    }, 0);
  };

  const formatoTimer = (secondi) => {
    const minuti = Math.floor(secondi / 60);
    const secondiRimanenti = secondi % 60;
    return `${minuti}:${secondiRimanenti < 10 ? '0' : ''}${secondiRimanenti}`;
  };

  return <span>{formatoTimer(tempoRimanente)}</span>;
}

export default Estrazione;
