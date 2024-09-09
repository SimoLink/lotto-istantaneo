import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import API from '../API.mjs';

function MessaggioNotifica(props) {
  const [notificaVincita, setNotificaVincita] = useState(-1);
  const [showModal, setShowModal] = useState(false); // Stato per gestire la visibilità del Modal
  const [highlight, setHighlight] = useState(true); // Stato per gestire il colore di evidenziazione

  useEffect(() => {
    // Recupera le notifiche
    const fetchNotifica = async () => {
      const notifica = await API.notificaVincita(props.idUtente);
      setNotificaVincita(notifica);
      if (notifica !== -1) {
        setShowModal(true); // Mostra il Modal se c'è una notifica
      }
    };
    fetchNotifica();

    // Ogni volta che `props.idUltimaEstrazione` cambia, il timer di evidenziazione si riavvia
    setHighlight(true);
    const timer = setTimeout(() => {
      setHighlight(false);
    }, 2000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [props.idUltimaEstrazione]); // Aggiungi props.idUltimaEstrazione come dipendenza

  const cancellaNotifica = (idUtente) => {
    API.notificaLetta(idUtente);
    setNotificaVincita(-1); // Nasconde la notifica impostando a -1
    setShowModal(false); // Nasconde il Modal
  };

  let numeriIndovinati = 0;
  if (notificaVincita === 10) {
    numeriIndovinati = 1;
  } else if (notificaVincita === 20) {
    numeriIndovinati = 2;
  } else if (notificaVincita === 30) {
    numeriIndovinati = 3;
  }

  const alertStyle = {
    backgroundColor: highlight ? 'orange' : '', // Giallo per i primi 3 secondi
    transition: 'background-color 2s ease-in-out', // Transizione morbida
  };

  return (
    <>
      {/* Modale per la notifica */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notifica Vincita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notificaVincita === -1 ? null : notificaVincita > 0 ? (
            <Alert style={alertStyle} variant="success">
              Complimenti, hai vinto! <br />
              RIEPILOGO <br />
              NUMERI INDOVINATI: {numeriIndovinati} <br />
              PUNTI VINTI: {notificaVincita}
            </Alert>
          ) : (
            <Alert style={alertStyle} variant="success">
              Mi spiace, non hai vinto
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => cancellaNotifica(props.idUtente)}>
            Cancella notifica
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MessaggioNotifica;

/*import { Alert, Button } from 'react-bootstrap';
import API from '../API.mjs';
import { useEffect, useState } from 'react';

function MessaggioNotifica(props) {
  const [notificaVincita, setNotificaVincita] = useState(-1);
  const [highlight, setHighlight] = useState(true); // Stato per gestire il colore di evidenziazione

  useEffect(() => {
    // Recupera le notifiche
    const notificaVincita = async () => {
      const notifica = await API.notificaVincita(props.idUtente);
      setNotificaVincita(notifica);
    };
    notificaVincita();

    // Ogni volta che `props.idUltimaEstrazione` cambia, il timer di evidenziazione si riavvia
    setHighlight(true);
    const timer = setTimeout(() => {
      setHighlight(false);
    }, 2000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [props.idUltimaEstrazione]); // Aggiungi props.idUltimaEstrazione come dipendenza

  const cancellaNotifica = (idUtente) => {
    API.notificaLetta(idUtente);
    setNotificaVincita(-1); // Nasconde la notifica impostando a -1
  };

  let numeriIndovinati = 0;
  if (notificaVincita === 10) {
    numeriIndovinati = 1;
  } else if (notificaVincita === 20) {
    numeriIndovinati = 2;
  } else if (notificaVincita === 30) {
    numeriIndovinati = 3;
  }

  const alertStyle = {
    backgroundColor: highlight ? 'orange' : '', // Giallo per i primi 3 secondi
    transition: 'background-color 2s ease-in-out', // Transizione morbida
  };

  return (
    <>
      {notificaVincita === -1 ? null : notificaVincita > 0 ? (
        <Alert style={alertStyle} className="mt-4" variant="success">
          Complimenti, hai vinto! <br />
          RIEPILOGO <br />
          NUMERI INDOVINATI: {numeriIndovinati} <br />
          PUNTI VINTI: {notificaVincita}
        </Alert>
      ) : (
        <Alert style={alertStyle} className="mt-4" variant="success">
          Mi spiace, non hai vinto
        </Alert>
      )}

      {notificaVincita !== -1 && (
        <Button className="mt-2" variant="outline-danger" onClick={() => cancellaNotifica(props.idUtente)}>
          Cancella notifica
        </Button>
      )}
    </>
  );
}

export default MessaggioNotifica;*/


/*import { Alert, Button } from 'react-bootstrap';
import API from '../API.mjs';
import { useEffect, useState } from 'react';

function MessaggioNotifica(props) {
  const [notificaVincita, setNotificaVincita] = useState(-1);

  useEffect(() => {
    // Recupera le notifiche
    const notificaVincita = async () => {
      const notifica = await API.notificaVincita(props.idUtente);
      setNotificaVincita(notifica);
    };
    notificaVincita();
  }, [props.idUltimaEstrazione]);

  const cancellaNotifica = (idUtente) => {
    API.notificaLetta(idUtente);
    setNotificaVincita(-1); // Nasconde la notifica impostando a -1
  };

  let numeriIndovinati = 0;
  if(notificaVincita === 10) {
    numeriIndovinati = 1;
  } else if(notificaVincita === 20) {
    numeriIndovinati = 2;
  } else if(notificaVincita === 30) {
    numeriIndovinati = 3;
  }


  return (
    <>
      {notificaVincita === -1 ? null : notificaVincita > 0 ? (
        <Alert className="mt-4" variant="success">
          Complimenti, hai vinto! <br />
          RIEPILOGO <br />
          NUMERI INDOVINATI: {numeriIndovinati} <br />
          PUNTI VINTI: {notificaVincita}
        </Alert>
      ) : (
        <Alert className="mt-4" variant="success">Mi spiace, non hai vinto</Alert>
      )}

      {notificaVincita !== -1 && (
        <Button variant="outline-danger" onClick={() => cancellaNotifica(props.idUtente)}>
          Cancella notifica
        </Button>
      )}
    </>
  );
}

export default MessaggioNotifica;*/

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