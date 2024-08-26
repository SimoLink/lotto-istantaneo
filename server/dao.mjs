import { getUserById } from './userDao.mjs';
import { db } from './db.mjs';
// inserimento nuova puntata
export const nuovaPuntata = (idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3) => {
  return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO puntate(idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3) VALUES(?,?,?,?,?,?)';
        db.run(sql, [idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3], function (err) {
          if (err)
            reject(err);
          else
            resolve(this.lastID);
        });
    });
  }

  export const getPunti = (idUtente) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT punti FROM utenti WHERE id = ?';
      
      db.get(query, [idUtente], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };
console.log(await getPunti(1));
  export const aggiornamentoPuntiDopoPuntata = (idUtente, totalePuntate) => {
    return new Promise((resolve, reject) => {
      getPunti(idUtente)
        .then(punti => {
          if (punti >= totalePuntate) {
            const query = 'UPDATE utenti SET punti = punti - ? WHERE id = ?';
            
            db.run(query, [totalePuntate, idUtente], function(err) {
              if (err) {
                reject(err);
                return;
              }
              resolve({ success: true, changes: this.changes });
            });
          } else {
            resolve({ success: false, message: 'Punti insufficienti' });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  console.log(await aggiornamentoPuntiDopoPuntata(1, 5));

  /* Funzione che:
    1. inserisce una nuova puntata
    2. diminuisce il totale dei punti dell'utente */
    export const processoPuntata = async (idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3) => {
      try {
      await nuovaPuntata(idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3);
      await aggiornamentoPuntiDopoPuntata(idUtente, totalePuntate);
    } catch (err) {
      console.error('Errore durante il processo della puntata:', err);
    }
    }

  //Recupera estrazione e relativa puntata
  export const getPuntataEstrazione = (idUtente, idEstrazione) => {
    return new Promise((resolve, reject) => {
      let queryPuntata = 'SELECT totalePuntate, puntata1, puntata2, puntata3 FROM puntate WHERE idUtente = ? AND idEstrazione = ?';
      
      let queryEstrazione = 'SELECT numero1, numero2, numero3, numero4, numero5 FROM estrazioni WHERE id = ?';
      
      // Recupera la puntata
      db.get(queryPuntata, [idUtente, idEstrazione-1], (err, puntata) => {
        if (err) {
          return reject(err);
        }
        
      // Recupera l'estrazione
      db.get(queryEstrazione, [idEstrazione], (err, estrazione) => {
        if (err) {
          return reject(err);
        }
          
      // Restituisci puntata e estrazione
      resolve({ puntata, estrazione });
        });
      });
    });
  }
  
  //Aggiorna i punti di uno specifico utente sovrascrivendo i punti precedenti
  export const aggiornaPunti = (idUtente, puntiAggiornati) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE utenti SET punti = ? WHERE id = ?';
      
      db.run(query, [puntiAggiornati, idUtente], function(err) {
        if (err) {
            reject(err); 
          } else {
            resolve(this.changes); // Restituisce il numero di righe aggiornate
          }
        });
      });
    }

    //calcolo vincita
    export const calcoloVincita = (puntata, estrazione) => {
      const numeriEstrazione = [estrazione.numero1, estrazione.numero2, estrazione.numero3, estrazione.numero4, estrazione.numero5];
      const numeriPuntata = [puntata.puntata1, puntata.puntata2, puntata.puntata3].filter(num => num !== null);
      
      // Calcola i numeri indovinati
      const numeriIndovinati = numeriPuntata.filter(num => numeriEstrazione.includes(num)).length;
      
      let puntiVinti = 0;
      switch (puntata.totalePuntate) {
        case 5:
          if (numeriIndovinati === 1) puntiVinti = 10;
          break;
        case 10:
          if (numeriIndovinati === 1) puntiVinti = 10;
          if (numeriIndovinati === 2) puntiVinti = 20;
          break;
        case 15:
          if (numeriIndovinati === 1) puntiVinti = 10;
          if (numeriIndovinati === 2) puntiVinti = 20;
          if (numeriIndovinati === 3) puntiVinti = 30;
          break;
        default:
          break;
      }
      
      return puntiVinti;
    }
    
    /* Funzione che avvia l'intero processo di una scommessa:
    1. dato un utente ed una estrazione, restituisce la puntata e l'estrazione
    2. data la puntata e l'estrazione, calcola il valore della vincita
    3. recupera i punti dell'utente e aggiorna i punti */
    export const processoScommessa = async (idUtente, idEstrazione) => {
    try {
    const { puntata, estrazione } = await getPuntataEstrazione(idUtente, idEstrazione);
    const puntiVinti = await calcoloVincita(puntata, estrazione);

    // Recupera il saldo attuale dell'utente
    const user = await getUserById(idUtente);
    const puntiAttuali = user.punti;
    console.log(puntiAttuali)
    // Calcola il nuovo saldo dei punti
    const puntiAggiornati = puntiAttuali + puntiVinti;
    console.log(puntiAggiornati)
    await aggiornaPunti(idUtente, puntiAggiornati);
  } catch (err) {
    console.error('Errore durante il processo della scommessa:', err);
  }
  }

  export const classifica = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT username, punti FROM utenti ORDER BY punti DESC LIMIT 3';
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({ username: row.username, punti: row.punti })));
      });
    });
  };
  export const inserimentoEstrazione = (numero1, numero2, numero3, numero4, numero5) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO estrazioni (numero1, numero2, numero3, numero4, numero5) VALUES (?, ?, ?, ?, ?)';
      
      db.run(query, [numero1, numero2, numero3, numero4, numero5], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ idEstrazione: this.lastID });  // Restituisce l'id della nuova estrazione creata
      });
    });
  };

  console.log(await inserimentoEstrazione(20, 21, 22, 23, 24));

  export const getUltimaEstrazione = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM estrazioni ORDER BY id DESC LIMIT 1';
      
      db.get(query, [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);  // Restituisce l'ultima estrazione trovata
      });
    });
  };
  console.log(await getUltimaEstrazione());

//FUNZIONI DI TEST, ELIMINA
/*

  async function testCalculateWinnings(idUtente, idEstrazione) {
    try {
      const { puntata, estrazione } = await getPuntataEstrazione(idUtente, idEstrazione);
      const puntiVinti = calcoloVincita(puntata, estrazione);
      
      console.log('Punti vinti:', puntiVinti);
    } catch (error) {
      console.error('Errore durante il calcolo dei punti:', error);
    }
  }
  
  testCalculateWinnings(1, 2); // Usa un ID di esempio
  processoScommessa(1, 2);

  async function testCreateBet() {
    try {
      const idUtente = 1; // Assicurati che questo utente esista nel tuo DB
      const idEstrazione = 1; // Assicurati che questa estrazione esista nel tuo DB
      const puntata1 = 5;
      const puntata2 = 12;
      const totalePuntate = 10;
  
      const result = await nuovaPuntata(idUtente, idEstrazione, totalePuntate, puntata1, puntata2);
      
      console.log('Puntata inserita con successo:', result);
    } catch (error) {
      console.error('Errore durante l\'inserimento della puntata:', error);
    }
  }
  
  testCreateBet();*/