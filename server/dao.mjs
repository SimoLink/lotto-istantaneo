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

/*
export const calcoloSpesa = (puntata1, puntata2, puntata3) => {
  // Crea un array con i valori delle puntate, escludendo i valori null
  const numeriPuntata = [puntata1, puntata2, puntata3].filter(num => num != null);

  // Calcola il totale dei punti basato sul numero di puntate valide
  const punti = numeriPuntata.length * 5;

  return punti;
};
Uso di != null: Ho cambiato il filtro per escludere null e undefined usando num != null. Questo è utile se desideri escludere entrambi i valori null e undefined. Puoi usare num !== null se desideri escludere solo null.

Semplificazione del Calcolo dei Punti: Il ciclo for è stato rimosso e sostituito con una semplice moltiplicazione. Poiché ogni valore valido contribuisce con 5 punti, basta moltiplicare la lunghezza dell'array filtrato per 5.

Eliminazione del Controllo Superfluo: Il controllo if(numeriPuntata[i] !== undefined) è superfluo perché gli elementi dell'array sono già garantiti essere diversi da null a questo punto.
*/

// inserimento nuova puntata
export const nuovaPuntata = (idUtente, idEstrazione, puntata1, puntata2, puntata3, totalePuntate) => {
  return new Promise((resolve, reject) => {

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
      const sql = 'SELECT punti FROM utenti WHERE id = ?';
  
      db.get(sql, [idUtente], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve({ error: "Utente non trovato." });
        } else {
          resolve(row.punti);
        }
      });
    });
  };

  export const verificaSaldo = async (idUtente, totalePuntate) => {
    try {
    const saldoUtente = await getPunti(idUtente);
    
    if(saldoUtente >= totalePuntate) {
      return true;
    } else {
      return false;
    } 
  } catch (error) {
      throw new Error("Impossibile verificare il saldo dell'utente.");
    }
  }

  export const aggiornamentoPuntiDopoPuntata = (idUtente, totalePuntate) => {
    return new Promise((resolve, reject) => {

            const query = 'UPDATE utenti SET punti = punti - ? WHERE id = ?';
            db.run(query, [totalePuntate, idUtente], function(err) {
              if (err) {
                reject(err);
              }
              resolve({ success: true, changes: this.changes });
            });
            
          
    });
  };

  /* Funzione che:
    1. inserisce una nuova puntata
    2. diminuisce il totale dei punti dell'utente */
    export const processoPuntata = async (idUtente, idEstrazione, puntata1, puntata2, puntata3) => {
      try {
      const totalePuntate = calcoloSpesa(puntata1, puntata2, puntata3);
      if(!await verificaSaldo(idUtente, totalePuntate)) {
        throw new Error('Saldo insufficiente');
      } else {
        await nuovaPuntata(idUtente, idEstrazione, puntata1, puntata2, puntata3, totalePuntate);
      await aggiornamentoPuntiDopoPuntata(idUtente, totalePuntate);
      }
      
    } catch (err) {
      throw err;
    }
    }





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
    

    //calcolo vincita
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

    //Aggiorna i punti di una specifica puntata
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

    //Aggiorna i punti di uno specifico utente sovrascrivendo i punti precedenti
  export const aggiornaPunti = (idUtente, puntiAggiornati) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE utenti SET punti = ? WHERE id = ?';
      
      db.run(query, [puntiAggiornati, idUtente], function(err) {
        if (err) {
            reject(err); 
          } else if (this.changes === 0) {
            resolve({ error: "Utente non trovato." }); 
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
    
        if (puntataEstrazione.error) {
          console.error(puntataEstrazione.error); //lascia in console l'errore
          return; // Esci dalla funzione se c'è un errore
        }
    
        // Usa Promise.all per gestire le promesse in parallelo
        await Promise.all(puntataEstrazione.map(async (row) => {
          try {
            const puntiVinti = calcoloVincita(row); // Aggiungi await per calcoloVincita
            const user = await getUserById(row.idUtente);
            console.log("L'utente corrente è", user);
    
            const puntiAttuali = user.punti;
            console.log("I punti attuali sono", puntiAttuali);
            console.log("I punti vinti sono", puntiVinti);
    
            // Calcola il nuovo saldo dei punti
            const puntiAggiornati = puntiAttuali + puntiVinti;
            console.log("I punti aggiornati sono", puntiAggiornati);
    
            await aggiornaPunti(user.id, puntiAggiornati);
          } catch (err) {
            // Gestisci gli errori individuali per ogni riga
            console.error('Errore durante il calcolo della vincita o l\'aggiornamento dei punti:', err);
          }
        }));
      } catch (err) {
        console.error('Errore durante il processo della scommessa:', err);
      }
    };
    

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
        } else if (rows.length === 0) {
          resolve({ error: "Nessun utente nel database." });
        } else {
          resolve(rows.map(row => ({ username: row.username, punti: row.punti })));
        }
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
            
            resolve(this.lastID);
      
            processoScommessa(this.lastID)
              .catch(err => {
                console.error('Errore durante il processo di scommessa:', err);
              });
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
        else if (row) {
          resolve(row);  // Restituisce l'ultima estrazione trovata
        } else {
          resolve(null); // Restituisce null se non ci sono risultati
        }
      });
    });
  };

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