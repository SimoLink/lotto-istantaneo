import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import API from '../API.mjs';

function FormScommessa(props) {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [budget, setBudget] = useState(0);
  const [error, setError] = useState("");
  const [controlloPuntata, setControlloPuntata] = useState(false);

  useEffect(() => {
    // Recupera l'ultima estrazione
    const getPunti = async () => {
      const punti = await API.getPunti(props.idUtente);
      setBudget(punti);
    };
    getPunti();
  }, [controlloPuntata]);

  useEffect(() => {
    const controlloPuntata = async () => {
      try {
        const response = await API.controlloPuntata(props.idUtente, props.idUltimaEstrazione);
        setControlloPuntata(response);
        if (!response) {
          resetForm();
        }
      } catch (error) {
        console.error("Errore durante il controllo della puntata:", error);
      }
    };
    controlloPuntata();
  }, [props.idUltimaEstrazione]);

  const resetForm = () => {
    setNum1("");
    setNum2("");
    setNum3("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const puntata1 = num1 ? parseInt(num1) : undefined;
    const puntata2 = num2 ? parseInt(num2) : undefined;
    const puntata3 = num3 ? parseInt(num3) : undefined;
    if (puntata1 === undefined && puntata2 === undefined && puntata3 === undefined) {
      setError('ATTENZIONE! Devi inserire almeno un numero.');
    } else {
      const idEstrazione = props.idUltimaEstrazione;
      const idUtente = props.idUtente;
      const puntata = { idUtente, idEstrazione, puntata1, puntata2, puntata3 };
      console.log(puntata);
      API.aggiungiPuntata(puntata)
        .then(() => {
          setControlloPuntata(true);
          setError("");
        })
        .catch(err => setError(err.errors[0].msg));
    }
  };

  const renderWarningMessage = () => {
    if (budget === 0) {
      return "Credito esaurito, non è possibile giocare.";
    } else if (budget === 5) {
      return "Attenzione, con il credito attuale puoi puntare solo 1 numero.";
    } else if (budget === 10) {
      return "Attenzione, con il credito attuale puoi puntare solo 2 numeri.";
    }
    return "";
  };

  return (
    <>
      <Row>
        <Col md={2}>
          <h2>Budget attuale: {budget} punti</h2>
        </Col>
        <Col>
          {error && (
            <Row className="mt-4 text-center">
              <Col md={10}>
                <Alert variant="danger">
                  {error}
                </Alert>
              </Col>
            </Row>
          )}

          {budget === 0 ? (
            <Row className="mt-4 text-center">
              <Col>
                <Alert variant="warning">
                  {renderWarningMessage()}
                </Alert>
              </Col>
            </Row>
          ) : (
            <>
              {renderWarningMessage() && (
                <Row className="mt-4 text-center">
                  <Col>
                    <Alert variant="warning">
                      {renderWarningMessage()}
                    </Alert>
                  </Col>
                </Row>
              )}

              {!controlloPuntata ? (
                <>
                  <Row className="mt-4 text-center">
                    <Col>
                      <h5>Digita fino a 3 numeri da scommettere per la prossima estrazione:</h5>
                    </Col>
                  </Row>

                  <Form onSubmit={handleSubmit}>
                    <Row className="justify-content-center mt-3">
                      <Col xs={12} sm={4} md={3}>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            name="num1"
                            placeholder="Numero1"
                            required
                            min="1"
                            max="90"
                            value={num1}
                            onChange={(event) => setNum1(event.target.value)}
                            disabled={budget < 5}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={4} md={3}>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            name="num2"
                            placeholder="Numero2"
                            min="1"
                            max="90"
                            value={num2}
                            onChange={(event) => setNum2(event.target.value)}
                            disabled={budget < 10}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={4} md={3}>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            name="num3"
                            placeholder="Numero3"
                            min="1"
                            max="90"
                            value={num3}
                            onChange={(event) => setNum3(event.target.value)}
                            disabled={budget < 15}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-3 text-center">
                      <Col>
                        <Button variant="warning" type="submit" disabled={budget < 5}>
                          Conferma
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </>
              ) : (
                <Row className="mt-4 text-center">
                  <Col>
                    <Alert variant="info">
                      Hai già giocato. <br /> Attendi il risultato della puntata.
                    </Alert>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </>
  );
}

export default FormScommessa;
