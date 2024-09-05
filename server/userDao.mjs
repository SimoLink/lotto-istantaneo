//INSERIRE PER LOGIN. RIVEDI TUTTO POICHé HO COPIATO DAL LAB 13
/**  NEW **/
import { db } from './db.mjs';
import crypto from 'crypto';

/*export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name};
        
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};*/

export const getUserById = (idUtente) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utenti WHERE id = ?';
    db.get(sql, [idUtente], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id, username: row.username, punti: row.punti};
        resolve(user);
      }
    });
  });
};

//INSERIRE query per aggiornare il numero di punti disponibili per un utente (dopo una vittoria o una puntata).

//INSERIRE query per ottenere i dettagli dei primi 3 giocatori con il maggior numero di punti, ordinati in ordine decrescente.