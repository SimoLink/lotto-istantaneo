import { Col, Row, Table } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';

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
        <Col>
          <h2>Prossima estrazione tra: <ContoRovescia tempoRimanente={props.tempoRimanente} test={props.test} /></h2>
        </Col>
        <Col className="text-end">
          <h2>Budget attuale: {props.budget} punti</h2>
        </Col>
      </Row>
    </>
  );
}

function ContoRovescia(props) {
  const [timeLeft, setTimeLeft] = useState(props.tempoRimanente);
  const workerRef = useRef(null);
  const initialTimeRef = useRef(props.tempoRimanente);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../countdownWorker.js', import.meta.url), { type: 'module' });

      workerRef.current.onmessage = (e) => {
        console.log('Main thread received:', e.data);
        setTimeLeft(e.data.timeLeft);
        if (e.data.timeLeft === 0) {
          props.test();
        }
      };

      // Avvia il Web Worker con il tempo iniziale
      workerRef.current.postMessage({ timeLeft: props.tempoRimanente });
    } else {
      // Aggiorna solo il tempo rimanente
      workerRef.current.postMessage({ timeLeft: props.tempoRimanente });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [props.tempoRimanente, props.test]);

  useEffect(() => {
    // Quando `tempoRimanente` cambia, invia il nuovo valore al worker
    if (workerRef.current) {
      workerRef.current.postMessage({ timeLeft: props.tempoRimanente });
    }
  }, [props.tempoRimanente]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
}

export default Estrazione;
