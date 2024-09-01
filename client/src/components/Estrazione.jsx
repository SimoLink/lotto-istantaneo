import { Col, Row, Table } from 'react-bootstrap';
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
        <Col>
        <h2>Prossima estrazione tra: <ContoRovescia tempoRimanente={props.tempoRimanente} /></h2>
        </Col>
        <Col className="text-end">
          <h2>Budget attuale: {props.budget} punti</h2> {/* Qui visualizziamo il budget dell'utente */}
        </Col>
      </Row>
    </>
  );
}

function ContoRovescia(props) {
  const [timeLeft, setTimeLeft] = useState(props.tempoRimanente);

  useEffect(() => {
    // Aggiorna il timeLeft quando cambia props.tempoRimanente
    setTimeLeft(props.tempoRimanente);
  }, [props.tempoRimanente]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Pulizia dell'intervallo quando il componente viene smontato
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
}

export default Estrazione;
