import { Alert, Button } from 'react-bootstrap';
import API from '../API.mjs';

function MessaggioNotifica(props) {
  return (
    <>
      {props.notificaVincita > 0 ? <Alert variant="success">Complimenti, hai vinto {props.notificaVincita} punti</Alert> :
      <Alert variant="success">Mi spiace, non hai vinto</Alert>}
      <Button variant="outline-danger" onClick={() => props.cancellaNotifica(2)}>Cancella notifica</Button>
    </>
  );
}

export default MessaggioNotifica;