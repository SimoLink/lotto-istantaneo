import sqlite from 'sqlite3';
import { getUserById } from './userDao.mjs';

//apertura del db
export const db = new sqlite.Database('./db.sqlite', (err) => {
    if(err) throw err;
});

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

  async function getPuntataEstrazione(idUtente, idEstrazione) {
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
  
  //calcolo vincita
  async function calcoloVincita(puntata, estrazione) {
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
  
  function  aggiornaPunti(idUtente, puntiAggiornati) {
      return new Promise((resolve, reject) => {
        const query = 'UPDATE utenti SET punti = ? WHERE id = ?';
        
        db.run(query, [puntiAggiornati, idUtente], function(err) {
          if (err) {
            reject(err); // Gestione errore
          } else {
            resolve(this.changes); // Restituisce il numero di righe aggiornate
          }
        });
      });
    }
    
  async function processoScommessa(idUtente, idEstrazione) {
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
  }


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
  
  testCreateBet();