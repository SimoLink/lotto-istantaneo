import { Alert, Button } from 'react-bootstrap';
import API from '../API.mjs';
import { useEffect, useState } from 'react';

function MessaggioNotifica(props) {
  const [notificaVincita, setNotificaVincita] = useState(-1);

  useEffect(() => {
    // Recupera le notifiche
    const notificaVincita = async () => {
      const notifica = await API.notificaVincita(2);
      setNotificaVincita(notifica);
    };
    notificaVincita();
  }, [props.idUltimaEstrazione]);

  const cancellaNotifica = (idUtente) => {
    API.notificaLetta(idUtente);
    setNotificaVincita(-1); // Nasconde la notifica impostando a -1
  };


  return (
    <><>
      {notificaVincita === -1 ? null : notificaVincita > 0 ? <Alert variant="success">Complimenti, hai vinto {notificaVincita} punti</Alert> :
      <Alert variant="success">Mi spiace, non hai vinto</Alert>}
      <Button variant="outline-danger" onClick={() => cancellaNotifica(2)}>Cancella notifica</Button></>
    </>
  );
}

export default MessaggioNotifica;

/*ALTERNATIVA
import React from 'react';
import { Alert, Button } from 'react-bootstrap';

function MessaggioNotifica({ notificaVincita, cancellaNotifica }) {
  // Determina il messaggio dell'alert in base al valore di notificaVincita
  const getAlertMessage = () => {
    if (notificaVincita > 0) {
      return `Complimenti, hai vinto ${notificaVincita} punti`;
    } else if (notificaVincita === 0) {
      return 'Mi spiace, non hai vinto';
    }
    return null;
  };

  // Verifica se visualizzare il messaggio e il bottone
  if (notificaVincita === -1) {
    return null;
  }

  return (
    <>
      <Alert variant="success">
        {getAlertMessage()}
      </Alert>
      <Button variant="outline-danger" onClick={() => cancellaNotifica(2)}>
        Cancella notifica
      </Button>
    </>
  );
}

export default MessaggioNotifica;
*/