import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import API from '../API.mjs';

function MessaggioNotifica(props) {
  const [notificaVincita, setNotificaVincita] = useState(-1);
  const [mostraNotifica, setMostraNotifica] = useState(false); 

  useEffect(() => {
    // Recupera le notifiche
    const recuperaNotifica = async () => {
      const notifica = await API.notificaVincita(props.idUtente);
      setNotificaVincita(notifica);
      if (notifica !== -1) {
        setMostraNotifica(true); // Mostra l'avviso se c'è una notifica
      }
    };
    recuperaNotifica();
  }, [props.idUltimaEstrazione]);

  const cancellaNotifica = (idUtente) => {
    API.notificaLetta(idUtente);
    setNotificaVincita(-1); // resetta la notifica
    setMostraNotifica(false); // Nascondi l'avviso
  };

  let numeriIndovinati = 0;
  if (notificaVincita === 10) {
    numeriIndovinati = 1;
  } else if (notificaVincita === 20) {
    numeriIndovinati = 2;
  } else if (notificaVincita === 30) {
    numeriIndovinati = 3;
  }

  return (
    <>
      <Modal show={mostraNotifica} onHide={() => setMostraNotifica(false)}>

        <Modal.Header closeButton>
          <Modal.Title>Risultato</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {notificaVincita === -1 ? null : notificaVincita > 0 ? (
            <Alert variant="success">
              Complimenti, hai vinto! <br />
              Durante l'ultima puntata hai indovinato {numeriIndovinati} numeri e vinto {notificaVincita} punti.
            </Alert>
          ) : (
            <Alert variant="danger">
              Mi spiace, non hai vinto.
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={() => cancellaNotifica(props.idUtente)}>
            Cancella notifica
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MessaggioNotifica;
