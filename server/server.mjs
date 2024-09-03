import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { classifica, getPunti, getUltimaEstrazione, inserimentoEstrazione, processoPuntata } from './dao.mjs';

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
  app.get('/api/classifica', async (req, res) => {
    try {
      const podio = await classifica();
      res.json(podio);
    } catch {
      res.status(500).end();
    }
  });

  // - GET `/api/utenti/:idUtente/punti`
  app.get('/api/utenti/:idUtente/punti', async (req, res) => {
    try {
      const punti = await getPunti(req.params.idUtente);
      res.json(punti);
    } catch {
      res.status(500).end();
    }
  });

  // - POST `/api/puntate`
  app.post('/api/puntate', async (req, res) => {
    const { idUtente, idEstrazione, puntata1, puntata2, puntata3 } = req.body;
  
    if (!idEstrazione || !puntata1) {
      return res.status(400).send("Missing required bet details.");
    }
  
    try {
      await processoPuntata(idUtente, idEstrazione, puntata1, puntata2, puntata3);
      res.status(200).json({ message: "Bet successfully placed and points updated." });
    } catch (err) {
      console.error('Error during bet process:', err);
      res.status(500).send("Internal Server Error");
    }
  });

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
      console.error('Errore durante la memorizzazione dell\'estrazione:', err);
    }
  }
  
  // Funzione eseguita ogni 2 minuti
  function eseguiCicloEstrazione() {
    estrazioneCorrente = generaNuovaEstrazione();
    memorizzaEstrazioneNelDatabase(estrazioneCorrente);
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
  app.get('/api/estrazioneCorrente', (req, res) => {
    res.json({
      idUltimaEstrazione,
      estrazione: estrazioneCorrente,
      tempoRimanente
    });
  });

// avvio del server
app.listen(port, () => {'API server started';
    eseguiCicloEstrazione(); // Genera subito una prima estrazione all'avvio del server
});