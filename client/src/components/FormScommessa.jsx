import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';

function FormScommessa(props) {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (num1 === '' && num2 === '' && num3 === '') {
      setError('ATTENZIONE! Devi inserire almeno un numero.');
    } else {
      const puntata = {num1, num2, num3};
      props.aggiungiPuntata(puntata);
    }
  };

  return (
    <>
      {error && (
        <Row className="mt-4 text-center">
        <Col>
        <h5>{error}</h5>
        </Col>
        </Row>
        )}

      <Row className="mt-4 text-center">
        <Col>
          <h5>Digita fino a 3 numeri da scommettere per la prossima estrazione:</h5>
        </Col>
      </Row>

        <Form onSubmit={handleSubmit}>  
      <Row className="justify-content-center mt-3">
        <Col xs={12} sm={4} md={3}>
      <Form.Group>
          <Form.Control type="number" name="num1" placeholder="Numero1" required min="1" max="90" value={num1} onChange={(event) => setNum1(event.target.value)}
            />
            </Form.Group>
        </Col>
        <Col xs={12} sm={4} md={3}>
        <Form.Group>
          <Form.Control type="number" name="num2" placeholder="Numero2" min="1" max="90" value={num2} onChange={(event) => setNum2(event.target.value)}
          />
        </Form.Group>
        </Col>
        <Col xs={12} sm={4} md={3}>
        <Form.Group>
          <Form.Control type="number" name="num3" placeholder="Numero3" min="1" max="90" value={num3} onChange={(event) => setNum3(event.target.value)}
          />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3 text-center">
        <Col>
          <Button variant="warning" type="submit">
            Conferma
          </Button>
        </Col>
      </Row>
      </Form>
    </>
  );
}

export default FormScommessa;
