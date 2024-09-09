import express, { json } from 'express';
import morgan from 'morgan';
import {body, check, validationResult} from 'express-validator';
import cors from 'cors';
import { classifica, controlloPuntata, getPunti, getUltimaEstrazione, inserimentoEstrazione, notificaLetta, notificaVincita, processoPuntata } from './dao.mjs';

// init express
const app = express();
const port = 3001;

//middleware
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/* ROUTE */

// GET `/api/estrazioni/ultima`
app.get('/api/estrazioni/ultima', async (req, res) => {
    try {
      const estrazione = await getUltimaEstrazione();
      res.json(estrazione);
    } catch {
      res.status(500).end();
    }
  });

  // - GET `/api/classifica`
  app.get('/api/classifica', async (req, res) => {//OK
    try {
      const podio = await classifica();
      res.status(200).json(podio);
    } catch {
      res.status(500).end();
    }
  });

  // - GET `/api/utenti/:idUtente/punti`
  app.get('/api/utenti/:idUtente/punti', async (req, res) => {
    try {
      const punti = await getPunti(req.params.idUtente);
      res.status(200).json(punti);
    } catch {
      res.status(500).end();
    }
  });

  // - POST `/api/puntate`
  app.post('/api/puntate', [
    check('idEstrazione').notEmpty(),
    check('puntata1').isInt({ min: 1, max: 90 }).withMessage('Il numero deve essere compreso tra 1 e 90'),
    check('puntata2').optional().isInt({ min: 1, max: 90 }).withMessage('Il numero deve essere compreso tra 1 e 90'),
    check('puntata3').optional().isInt({ min: 1, max: 90 }).withMessage('Il numero deve essere compreso tra 1 e 90'),
    body().custom((value) => {
      const { puntata1, puntata2, puntata3 } = value;
  
      // Controllo se i numeri sono distinti
      const numeri = [puntata1, puntata2, puntata3].filter(num => num !== undefined && num !== null);
      const setNumeri = new Set(numeri);
      if (setNumeri.size !== numeri.length) {
        throw new Error('I numeri devono essere distinti');
      }
      return true;
    })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    const { idUtente, idEstrazione, puntata1, puntata2, puntata3 } = req.body;
  
    try {
      await processoPuntata(idUtente, idEstrazione, puntata1, puntata2, puntata3);
      res.status(201).json({ message: "Bet successfully placed and points updated." });
    } catch (err) {
      res.status(500).json({ errors: [{ msg: err.message }] });
    }
  });
  
  /*app.post('/api/puntate', [
    check('idEstrazione').notEmpty(),
    check('puntata1').isNumeric(),
    check('puntata2').isNumeric().optional(),
    check('puntata3').isNumeric().optional()
  ], async (req, res) => {//OK
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    const { idUtente, idEstrazione, puntata1, puntata2, puntata3 } = req.body;

  
    try {
      await processoPuntata(idUtente, idEstrazione, puntata1, puntata2, puntata3);
      res.status(201).json({ message: "Bet successfully placed and points updated." });
    } catch (err) {
      res.status(500).json({ error: err.message });    }
  });*/

  let estrazioneCorrente = null;
  let tempoRimanente = 120; // Tempo iniziale di 2 minuti
  let idUltimaEstrazione = null;
  
  // Funzione per generare una nuova estrazione
  function generaNuovaEstrazione() {
    const estrazione = [];
    while (estrazione.length < 5) {
      const numero = Math.floor(Math.random() * 90) + 1;
      if (!estrazione.includes(numero)) {
        estrazione.push(numero);
      }
    }
    return estrazione;
  }
  
  // Funzione per memorizzare l'estrazione nel database
  async function memorizzaEstrazioneNelDatabase(estrazione) {
    try {
      idUltimaEstrazione = await inserimentoEstrazione(...estrazione);
      console.log(`Nuova estrazione generata e memorizzata: ${estrazione}`);
    } catch (err) {
      throw new Error("Errore nell'inserimento dell'estrazione nel db: ", err);
    }
  }
  
  // Funzione eseguita ogni 2 minuti
  function eseguiCicloEstrazione() {
    estrazioneCorrente = generaNuovaEstrazione();
    memorizzaEstrazioneNelDatabase(estrazioneCorrente).catch(err => console.error('Errore nel ciclo di estrazione:', err));;
    tempoRimanente = 120; // Reset del timer
  }
  
  // Impostazione del ciclo ogni 2 minuti
  setInterval(eseguiCicloEstrazione, 120000); // 120000 millisecondi = 2 minuti
  
  // Decrementa il tempo rimanente ogni secondo
  setInterval(() => {
    if (tempoRimanente > 0) {
      tempoRimanente--;
    }
  }, 1000);
  
  // API per ottenere l'estrazione corrente e il tempo rimanente
  app.get('/api/estrazioneCorrente', async (req, res) => {//OK
    try {
      // Verifica che i dati esistano prima di restituirli
      if (!idUltimaEstrazione || !estrazioneCorrente) {
        res.status(500).json({ error: 'Nessuna estrazione disponibile al momento.' });
        return;
      }
  
      // Restituisce i dati con codice 200 OK
      res.status(200).json({
        idUltimaEstrazione,
        estrazione: estrazioneCorrente,
        tempoRimanente
      });
    } catch (error) {
      res.status(500).json({ error: 'Errore interno del server.' });
    }
  });

  app.get('/api/controlloPuntata/:idEstrazione/:idUtente', async (req, res) => {
    try {
      const controllo = await controlloPuntata(req.params.idUtente, req.params.idEstrazione);
      res.json(controllo);
    } catch {
      res.status(500).end();
    }
  });

  /*app.post('/api/controlloPuntata', async (req, res) => {
    try {
      const controllo = await controlloPuntata(req.body.idUtente, req.body.idEstrazione);
      res.json(controllo);
    } catch {
      res.status(500).end();
    }
  });*/

  app.post('/api/notificaVincita', async (req, res) => { //MODIFICA DOPO LOGIN
    try {
      const notifica = await notificaVincita(req.body.idUtente);
      res.json(notifica);
    } catch {
      res.status(500).end();
    }
  });

  app.put('/api/notificaLetta', async (req, res) => { //OK
    try {
      const notifica = await notificaLetta(req.body.idUtente);
      res.status(200).end();
    } catch {
      res.status(503).end();
    }
  });

// avvio del server
app.listen(port, () => {'API server started';
    eseguiCicloEstrazione(); // Genera subito una prima estrazione all'avvio del server
});