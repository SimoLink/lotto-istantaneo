import { getUserById } from './userDao.mjs';
import { db } from './db.mjs';

//Funzione che restituisce la classifica dei primi 3 utenti in ordine decrescente di punti
export const classifica = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT username, punti FROM utenti ORDER BY punti DESC LIMIT 3';

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err); 
      } else if (rows.length === 0) {
        resolve({ error: "Nessun utente nel database." });
      } else {
        resolve(rows.map(row => ({ username: row.username, punti: row.punti })));
      }
    });
  });
};

//Funzione che inserisce una nuova estrazione nel database.
export const inserimentoEstrazione = (numero1, numero2, numero3, numero4, numero5) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO estrazioni (numero1, numero2, numero3, numero4, numero5) VALUES (?, ?, ?, ?, ?)';

    db.run(query, [numero1, numero2, numero3, numero4, numero5], function(err) {
      if (err) {
        reject(err); 
        return;
      }
      
      resolve(this.lastID);

      processoScommessa(this.lastID) //Avvia il processo di scommessa per l'estrazione appena inserita
        .catch(err => {
          console.error('Errore durante il processo di scommessa:', err);
        });
    });
  });
};

    /* Funzione che avvia l'intero processo di vincita di una scommessa:
    1. dato un utente ed una estrazione, restituisce la puntata e l'estrazione
    2. data la puntata e l'estrazione, calcola il valore della vincita
    3. recupera i punti dell'utente e li aggiorna */
    export const processoScommessa = async (idEstrazione) => {
      try {
        const puntataEstrazione = await getPuntataEstrazione(idEstrazione);
    
        if (puntataEstrazione.error) {
          console.error(puntataEstrazione.error); 
          return;
        }

        //Aggiorno in parallelo i punti degli utenti
        await Promise.all(puntataEstrazione.map(async (row) => {
          try {
            const puntiVinti = calcoloVincita(row); 
            const user = await getUserById(row.idUtente);
    
            const puntiAttuali = user.punti;
    
            const puntiAggiornati = puntiAttuali + puntiVinti; //Calcola il nuovo saldo
    
            await aggiornaPunti(user.id, puntiAggiornati);
          } catch (err) {
            console.error('Errore durante il calcolo della vincita:', err);
          }
        }));
      } catch (err) {
        console.error('Errore durante il processo della scommessa:', err);
      }
    };

    //Effettua il join tra l'ultima estrazione e la tabella puntate
    export const getPuntataEstrazione = (idEstrazione) => {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3, numero1, numero2, numero3, numero4, numero5 FROM estrazioni, puntate WHERE estrazioni.id = ? AND estrazioni.id = puntate.idEstrazione';
        
        db.all(sql, [idEstrazione], (err, rows) => {
          if (err) {
            reject(err); 
          } else if (rows.length === 0) {
            resolve({ error: "Nessuna puntata trovata per questa estrazione." }); 
          } else {
            resolve(rows); 
          }
        });
      });
    };

    // Calcola quanti punti un utente ha vinto durante una puntata
    export const calcoloVincita = (puntataEstrazione) => {
      try {
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
    } catch (error) {
      throw new Error('Impossibile calcolare la vincita.');
    }
    }

    // Aggiorna i punti di una specifica puntata
    export const aggiornaPuntiPuntata = (idUtente, puntiVinti) => {
      return new Promise((resolve, reject) => {
        const query = 'UPDATE puntate SET puntiVinti = ? WHERE idUtente = ?';
        
        db.run(query, [puntiVinti, idUtente], function(err) {
          if (err) {
              reject(err); 
            } else if (this.changes === 0) {
              resolve({ error: "Utente non trovato." }); 
            } else {
              resolve(this.changes); 
            }
          });
        });
      }


   // Aggiorna i punti di uno specifico utente sovrascrivendo i punti precedenti
   export const aggiornaPunti = (idUtente, puntiAggiornati) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE utenti SET punti = ? WHERE id = ?';
      
      db.run(query, [puntiAggiornati, idUtente], function(err) {
        if (err) {
            reject(err); 
          } else if (this.changes === 0) {
            resolve({ error: "Utente non trovato." }); 
          } else {
            resolve(this.changes); 
          }
        });
      });
    }
    /*Fine processo scommessa*/

    // Ritorna l'ultima estrazione
    export const getUltimaEstrazione = () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM estrazioni ORDER BY id DESC LIMIT 1';
        
        db.get(query, [], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          else if (row) {
            resolve(row);  
          } else {
            resolve(null); 
          }
        });
      });
    };

 /* Funzione che:
    1. inserisce una nuova puntata
    2. diminuisce il totale dei punti dell'utente */
    export const processoPuntata = async (idUtente, puntata1, puntata2, puntata3) => {
      try {
      const totalePuntate = calcoloSpesa(puntata1, puntata2, puntata3);
      if(!await verificaSaldo(idUtente, totalePuntate)) {
        throw new Error('Saldo insufficiente');
      } else {
        await nuovaPuntata(idUtente, puntata1, puntata2, puntata3, totalePuntate);
      await aggiornamentoPuntiDopoPuntata(idUtente, totalePuntate);
      }
      
    } catch (err) {
      throw err;
    }
    }

// Calcolo punti da sottrarre per una giocata
export const calcoloSpesa = (puntata1, puntata2, puntata3) => {
  const numeriPuntata = [puntata1, puntata2, puntata3].filter(num => num !== null && num !== undefined);
    
  let punti = 0;
  for(let i = 0; i < numeriPuntata.length; i++) {
      punti += 5;
  }
  return punti;
}

// Verifica se l'utente ha abbastanza punti per giocare
export const verificaSaldo = async (idUtente, totalePuntate) => {
  try {
  const user = await getUserById(idUtente);
  console.log(user.punti, totalePuntate);
  if(user.punti >= totalePuntate) {
    return true;
  } else {
    return false;
  } 
} catch (error) {
    throw new Error("Impossibile verificare il saldo dell'utente.");
  }
}

// Inserimento di una nuova puntata 
export const nuovaPuntata = (idUtente, puntata1, puntata2, puntata3, totalePuntate) => {
  return new Promise(async (resolve, reject) => {
    const ultimaEstrazione = await getUltimaEstrazione();

        let sql = 'INSERT INTO puntate(idUtente, idEstrazione, totalePuntate, puntata1, puntata2, puntata3) VALUES(?,?,?,?,?,?)';
        db.run(sql, [idUtente, ultimaEstrazione.id+1, totalePuntate, puntata1, puntata2, puntata3], function (err) {
          if (err)
            reject(err);
          else
            resolve(this.lastID);
        });
      
    });
  }

  // Aggiorna i punti dell'utente, sottraendogli i punti usati per una puntata
  export const aggiornamentoPuntiDopoPuntata = (idUtente, totalePuntate) => {
    return new Promise((resolve, reject) => {

            const query = 'UPDATE utenti SET punti = punti - ? WHERE id = ?';
            db.run(query, [totalePuntate, idUtente], function(err) {
              if (err) {
                reject(err);
              }
              resolve(this.changes);
            });
    });
  };

  // Verifica se l'utente ha già giocato per l'estrazione corrente
  export const controlloPuntata = (idUtente, idEstrazione) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM puntate WHERE idUtente = ? AND idEstrazione = ?';
      
      db.get(query, [idUtente, parseInt(idEstrazione) + 1], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        else if(row){
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    });
  };

  // Mostra il risultato dell'ultima giocata di un utente
  export const notificaVincita = (idUtente) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT puntiVinti FROM puntate WHERE idUtente = ? AND notifica = 0 AND puntiVinti IS NOT NULL ORDER BY idEstrazione DESC LIMIT 1';
      
      db.get(query, [idUtente], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        else if(row){
          resolve(row.puntiVinti);
        }
        else {
          resolve(-1);
        }
      });
    });
  };

  // Segna come letto l'ultimo risultato di un utente
  export const notificaLetta = (idUtente) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE puntate SET notifica = 1 WHERE idUtente = ?';
      
      db.run(query, [idUtente], function(err) {
        if (err) {
            reject(err); 
          } else {
            resolve(this.changes); 
          }
        });
      });
    }