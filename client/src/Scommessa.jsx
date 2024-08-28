import React, { useState } from 'react';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';

function Scommessa(props) {
  const [betNumbers, setBetNumbers] = useState({ num1: null, num2: null, num3: null });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (value === '') {
      setBetNumbers({
        ...betNumbers,
        [name]: null, // Imposta a null se il campo è vuoto
      });
    } else if (value >= 1 && value <= 90) {
      setBetNumbers({
        ...betNumbers,
        [name]: parseInt(value), // Imposta il numero se valido
      });
      setError('');
    } else {
      setError('I numeri devono essere compresi tra 1 e 90.');
    }
  };

  const handleSubmit = () => {
    if (betNumbers.num1 === null && betNumbers.num2 === null && betNumbers.num3 === null) {
      setError('Devi inserire almeno un numero.');
    } else {
      // Logica per inviare i numeri scommessi
      console.log('Numeri scommessi:', betNumbers);
      if (props.onSubmit) {
        props.onSubmit(betNumbers);
      }
    }
  };

  return (
    <>
      <Row className="mt-4 text-center">
        <Col>
          <h5>Digita fino a 3 numeri da scommettere per la prossima estrazione:</h5>
        </Col>
      </Row>

      {error && (
        <Row className="mt-2 text-center">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center mt-3">
        <Col xs={12} sm={4} md={3}>
          <Form.Control
            type="number"
            name="num1"
            placeholder="Numero 1"
            value={betNumbers.num1 !== null ? betNumbers.num1 : 'ciao'}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={12} sm={4} md={3}>
          <Form.Control
            type="number"
            name="num2"
            placeholder="Numero 2"
            value={betNumbers.num2 !== null ? betNumbers.num2 : ''}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={12} sm={4} md={3}>
          <Form.Control
            type="number"
            name="num3"
            placeholder="Numero 3"
            value={betNumbers.num3 !== null ? betNumbers.num3 : ''}
            onChange={handleInputChange}
          />
        </Col>
      </Row>

      <Row className="mt-3 text-center">
        <Col>
          <Button variant="warning" onClick={handleSubmit}>
            Conferma
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Scommessa;
