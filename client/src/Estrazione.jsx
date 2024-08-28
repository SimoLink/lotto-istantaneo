import { Col, Row, Table } from 'react-bootstrap';
import ContoRovescia from './ContoRovescia';
import Scommessa from './Scommessa';

function Estrazione(props) {
    const handleScommessaSubmit = (betNumbers) => {
        console.log('Numeri scommessi inviati al server:', betNumbers);
        // Qui potresti inviare i dati al server o gestirli come necessario
      };

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

      <Scommessa onSubmit={handleScommessaSubmit} />
    </>
  );
}

export default Estrazione;
