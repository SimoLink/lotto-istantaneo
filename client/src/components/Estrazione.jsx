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
              <td>{props.estrazione.numero1}</td>
              <td>{props.estrazione.numero2}</td>
              <td>{props.estrazione.numero3}</td>
              <td>{props.estrazione.numero4}</td>
              <td>{props.estrazione.numero5}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row>
        <Col>
        <h2>Prossima estrazione tra: <ContoRovescia duration={120} /></h2> {/* Passa 120 secondi come durata */}
        </Col>
        <Col className="text-end">
          <h2>Budget attuale: {props.budget} punti</h2> {/* Qui visualizziamo il budget dell'utente */}
        </Col>
      </Row>
    </>
  );
}

function ContoRovescia({ duration }) {
  const [timeLeft, setTimeLeft] = useState(duration);

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
