/* NEW */
import { useState } from 'react';
import { Form, Button, Row, Col, Nav, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      
      const credentials = { username, password };
      
      props.login(credentials);
  };

  return (
    <Row>
      <Col md={6}>
          <h5>Regole del gioco</h5>
          <p>
          Ogni giocatore può puntare su 1, 2 o 3 numeri distinti nell'intervallo 1-90. Un giocatore può fare una sola puntata per estrazione.
            Ogni due minuti, viene generata un’estrazione di cinque numeri.
            Le puntate si effettuano con dei punti a disposizione di ogni giocatore. Puntare su un numero costa 5 punti,
            su due 10 punti e su tre 15 punti. Un giocatore può effettuare una puntata solo se ha sufficienti punti a disposizione per coprire il costo di quella puntata.
            Ogni giocatore ha un budget iniziale di 100 punti. Il budget si può incrementare solo vincendo al gioco; una volta azzerato non si può più giocare.
          </p>
          <p>
          La tabella sottostante riassume i punteggi ottenibili nei tre casi, secondo tutte le puntate possibili.
          </p>
          <Table responsive striped bordered>
      <thead>
        <tr>
          <th>Puntata</th>
          <th>Numeri Indovinati</th>
          <th>Punti Guadagnati</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>1</td>
          <td>10 punti</td>
        </tr>
        <tr>
          <td>2</td>
          <td>1</td>
          <td>10 punti</td>
        </tr>
        <tr>
          <td>2</td>
          <td>2</td>
          <td>20 punti</td>
        </tr>
        <tr>
          <td>3</td>
          <td>1</td>
          <td>10 punti</td>
        </tr>
        <tr>
          <td>3</td>
          <td>2</td>
          <td>20 punti</td>
        </tr>
        <tr>
          <td>3</td>
          <td>3</td>
          <td>30 punti</td>
        </tr>
        <tr>
          <td>1, 2 o 3</td>
          <td>0</td>
          <td>0 punti</td>
        </tr>
      </tbody>
    </Table>
          
      </Col>
      <Col md={6} className='bg-light p-5 rounded d-flex justify-content-center'>
        <Form className='w-75' onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={4}/>
          </Form.Group>

          <Button type='submit'>Login</Button>
          <Link className='btn btn-danger mx-2 my-2' to={'/'} >Cancel</Link>
      </Form>
    </Col>
  </Row>
  )
};

/*function LogoutButton(props) {
  return(
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}*/
function LogoutButton(props) {
  return (
    <Nav.Link className="fs-4" onClick={props.logout} >
      Logout
    </Nav.Link>
  );
}

export { LoginForm, LogoutButton };