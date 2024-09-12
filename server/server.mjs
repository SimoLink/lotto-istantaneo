import express, { json } from 'express';
import morgan from 'morgan';
import {body, check, validationResult} from 'express-validator';
import cors from 'cors';
import { classifica, controlloPuntata, getUltimaEstrazione, inserimentoEstrazione, notificaLetta, notificaVincita, processoPuntata } from './dao.mjs';

//Passport
import passport from 'passport';
import LocalStrategy from 'passport-local'; //strategia username e password
import session from 'express-session';
import { getUser, getUserById } from './userDao.mjs';

// init express
const app = express();
const port = 3001;

//middleware
app.use(express.json()); //converte i json in javascript
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true //abilita i cookie cross-origin
};
app.use(cors(corsOptions));

//Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if (!user) {
    return cb(null, false, 'Incorrect username or password.' );
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null,user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ error: 'Utente non autenticato.' });
  }
};

app.use(session({
  secret: "lotto istantaneo simone",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/* Generazione estrazione e timer di 2 minuti */
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

/* ROUTE */

// - GET `/api/classifica`
app.get('/api/classifica', isLoggedIn, async (req, res) => {
  try {
    const podio = await classifica();
    res.status(200).json(podio);
  } catch {
    res.status(500).end();
  }
});

// - GET `/api/estrazioneCorrente`
app.get('/api/estrazioneCorrente', isLoggedIn, async (req, res) => {
  try {
    const ultimaEstrazione = await getUltimaEstrazione();

    if (!ultimaEstrazione) {
      res.status(500).json({ error: 'Nessuna estrazione disponibile al momento.' });
      return;
    }

    res.status(200).json({
      idUltimaEstrazione: ultimaEstrazione.id,
      estrazione: [ultimaEstrazione.numero1, ultimaEstrazione.numero2, ultimaEstrazione.numero3, ultimaEstrazione.numero4, ultimaEstrazione.numero5],
      tempoRimanente
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore interno del server.' });
  }
});

// - POST `/api/puntate`
app.post('/api/puntate', isLoggedIn, [
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

  const { idUtente, puntata1, puntata2, puntata3 } = req.body;

  try {
    await processoPuntata(idUtente, puntata1, puntata2, puntata3);
    res.status(201).json({ message: "Puntata inserita con successo." });
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] }); //express-validator usa un array di errori, pertanto seguo la stessa sintassi
  }
});

// - GET `/api/controlloPuntata/:idEstrazione/:idUtente`
app.get('/api/controlloPuntata/:idEstrazione/:idUtente', isLoggedIn, 
  [check('idEstrazione').isInt({ min: 0 }),
    check('idUtente').isInt({ min: 0 })],
    async (req, res) => {
      const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const controllo = await controlloPuntata(req.params.idUtente, req.params.idEstrazione);
    res.status(200).json(controllo);
  } catch {
    res.status(500).end();
  }
});

// - GET `/api/utenti/:idUtente/punti`
  app.get('/api/utenti/:idUtente/punti', isLoggedIn, 
    [
      check('idUtente').isInt({ min: 0 })],
      async (req, res) => {
        const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    try {
      const user = await getUserById(req.params.idUtente);
      res.status(200).json(user.punti);
    } catch {
      res.status(500).end();
    }
  });

    // - GET `/api/notificaVincita/:idUtente`
  app.get('/api/notificaVincita/:idUtente', isLoggedIn, 
    [
      check('idUtente').isInt({ min: 0 })],
      async (req, res) => { 
        const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    try {
      const notifica = await notificaVincita(req.params.idUtente);
      res.status(200).json(notifica);
    } catch {
      res.status(500).end();
    }
  });

    // - PUT `/api/notificaLetta`
  app.put('/api/notificaLetta', isLoggedIn, async (req, res) => { 
    try {
      await notificaLetta(req.body.idUtente);
      res.status(200).end();
    } catch {
      res.status(500).end();
    }
  });

  // POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current 
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// avvio del server
app.listen(port, () => {'API server started';
    eseguiCicloEstrazione(); // Genera subito una prima estrazione all'avvio del server
});