import { Col, Container, Row, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function TabellaClassifica(props) {
  return (
    <Container>
      <Row className="mt-4 text-center">
        <Col>
          <h3>Classifica dei migliori 3</h3>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8}>
          <Table responsive striped bordered>
            <thead>
              <tr>
                <th>Posizione</th>
                <th>Username</th>
                <th>Punti</th>
              </tr>
            </thead>
            <tbody>
              {props.classifica.map((utente, indice) => (
                <tr key={indice}>
                  <td>{indice + 1}</td>
                  <td>{utente.username}</td>
                  <td>{utente.punti}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default TabellaClassifica;
