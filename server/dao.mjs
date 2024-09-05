import { getUserById } from './userDao.mjs';
import { db } from './db.mjs';

//calcolo punti da sottrarre per giocata
export const calcoloSpesa = (puntata1, puntata2, puntata3) => {
  const numeriPuntata = [puntata1, puntata2, puntata3].filter(num => num !== null);
    
  let punti = 0;
  for(let i = 0; i < numeriPuntata.length; i++) {
    if(numeriPuntata[i] !== undefined) {
      punti += 5;
    }
  }
  return punti;
}

// inserimento nuova puntata
export const nuovaPuntata = (idUtente, idEstrazione, puntata1, puntata2, puntata3) => {
  return new Promise((resolve, reject) => {
        const totalePuntate = calcoloSpesa(puntata1, puntata2, puntata3);
        let sql = 'INSERT INTO puntate(idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3) VALUES(?,?,?,?,?,?)';
        db.run(sql, [idUtente, idEstrazione+1, totalePuntate, puntata1, puntata2, puntata3], function (err) {
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
        resolve(row.punti);
      });
    });
  };

  export const aggiornamentoPuntiDopoPuntata = (idUtente, totalePuntate) => {
    return new Promise((resolve, reject) => {
      getPunti(idUtente)
        .then(punti => {
          console.log(punti);

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
    export const processoPuntata = async (idUtente, idEstrazione, puntata1, puntata2, puntata3) => {
      try {
      await nuovaPuntata(idUtente, idEstrazione, puntata1, puntata2, puntata3);
      const totalePuntate = calcoloSpesa(puntata1, puntata2, puntata3);
      await aggiornamentoPuntiDopoPuntata(idUtente, totalePuntate);
    } catch (err) {
      console.error('Errore durante il processo della puntata:', err);
    }
    }





    export const getPuntataEstrazione = (idEstrazione) => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3, numero1, numero2, numero3, numero4, numero5 FROM estrazioni, puntate WHERE id = ? AND id = idEstrazione';
        
        db.all(query, [idEstrazione], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
      });
    };

    //calcolo vincita
    export const calcoloVincita = (puntataEstrazione) => {
      const numeriEstrazione = [puntataEstrazione.numero1, puntataEstrazione.numero2, puntataEstrazione.numero3, puntataEstrazione.numero4, puntataEstrazione.numero5];
      const numeriPuntata = [puntataEstrazione.puntata1, puntataEstrazione.puntata2, puntataEstrazione.puntata3].filter(num => num !== null);
      
      // Calcola i numeri indovinati
      const numeriIndovinati = numeriPuntata.filter(num => numeriEstrazione.includes(num)).length;
      
      let puntiVinti = 0;
      switch (puntataEstrazione.totalePuntate) {
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
      aggiornaPuntiPuntata(puntataEstrazione.idUtente, puntiVinti);
      
      return puntiVinti;
    }

    //Aggiorna i punti di una specifica puntata
    export const aggiornaPuntiPuntata = (idUtente, puntiVinti) => {
      return new Promise((resolve, reject) => {
        const query = 'UPDATE puntate SET puntiVinti = ? WHERE idUtente = ?';
        
        db.run(query, [puntiVinti, idUtente], function(err) {
          if (err) {
              reject(err); 
            } else {
              resolve(this.changes); // Restituisce il numero di righe aggiornate
            }
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

    /* Funzione che avvia l'intero processo di una scommessa:
    1. dato un utente ed una estrazione, restituisce la puntata e l'estrazione
    2. data la puntata e l'estrazione, calcola il valore della vincita
    3. recupera i punti dell'utente e aggiorna i punti */
    export const processoScommessa = async (idEstrazione) => {
    try {
    const puntataEstrazione = await getPuntataEstrazione(idEstrazione);
    if(puntataEstrazione.length !== 0){
      puntataEstrazione.map(async row => {
        const puntiVinti = calcoloVincita(row);
        const user = await getUserById(row.idUtente);
        console.log("l'utente corrente è", user)
      const puntiAttuali = user.punti;
      console.log("i punti attuali sono", puntiAttuali)
      console.log("i punti attuali sono", puntiVinti)

      // Calcola il nuovo saldo dei punti
      const puntiAggiornati = puntiAttuali + puntiVinti;
      console.log("i punti aggiornati sono", puntiAggiornati)
      await aggiornaPunti(user.id, puntiAggiornati);
      });

      
      /*console.log("risultato", puntataEstrazione.idUtente)
      console.log("hai vinto " + puntiVinti)
  
      // Recupera il saldo attuale dell'utente
      const user = await getUserById(puntataEstrazione.idUtente);
      console.log("l'utente corrente è", user)
      const puntiAttuali = user.punti;
      console.log("i punti attuali sono", puntiAttuali)
      // Calcola il nuovo saldo dei punti
      const puntiAggiornati = puntiAttuali + puntiVinti;
      console.log("i punti aggiornati sono", puntiAggiornati)
      await aggiornaPunti(puntataEstrazione.idUtente, puntiAggiornati);*/
    } 
    } catch (err) {
      console.error('Errore durante il processo della scommessa:', err);
    
  }
  }

    /*LAVORI IN CORSO WORK IN PROGRESS
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
    /*export const processoScommessa = async (idUtente, idEstrazione) => {
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
  }*/

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
      
      //db.run(query, [numero1, numero2, numero3, numero4, numero5], function(err) {
      db.run(query, [1, 2, 3, 4, 5], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);  // Restituisce l'id della nuova estrazione creata
        processoScommessa(this.lastID);
      });
    });
  };

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

  export const controlloPuntata = (idUtente, idEstrazione) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM puntate WHERE idUtente = ? AND idEstrazione = ?';
      
      db.get(query, [idUtente, idEstrazione+1], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if(row){
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    });
  };

  export const notificaVincita = (idUtente) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT puntiVinti FROM puntate WHERE idUtente = ? AND notifica = 0 AND puntiVinti IS NOT NULL ORDER BY idEstrazione DESC LIMIT 1';
      
      db.get(query, [idUtente], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if(row){
          resolve(row.puntiVinti);
        }
        else {
          resolve(-1);
        }
      });
    });
  };

  export const notificaLetta = (idUtente) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE puntate SET notifica = 1 WHERE idUtente = ?';
      
      db.run(query, [idUtente], function(err) {
        if (err) {
            reject(err); 
          } else {
            resolve(this.changes); // Restituisce il numero di righe aggiornate
          }
        });
      });
    }

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