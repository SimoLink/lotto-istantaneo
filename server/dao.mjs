import sqlite from 'sqlite3';

//apertura del db
const db = new sqlite.Database('./db.sqlite', (err) => {
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

  //calcolo vincita
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

  function calcoloVincita(puntata, estrazione) {
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

function  aggiornaPunti(idUtente, puntiVinti) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE utenti SET punti = ? WHERE id = ?';
      
      db.run(query, [puntiVinti, idUtente], function(err) {
        if (err) {
          reject(err); // Gestione errore
        } else {
          resolve(this.changes); // Restituisce il numero di righe aggiornate
        }
      });
    });
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










/** QUESTIONS **/
// get all the questions
export const listQuestions = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT question.*, user.email FROM question JOIN user ON question.authorId = user.id';
      db.all(sql, [], (err, rows) => {
        if (err)
          reject(err);
        else {
          const questions = rows.map((q) => new Question(q.id, q.text, q.email, q.date));
          resolve(questions);
        }
      });
    });
  }
  
  // get a question given its id
  export const getQuestion = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT question.*, user.email FROM question JOIN user ON question.authorId = user.id WHERE question.id = ?';
      db.get(sql, [id], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({error: "Question not available, check the inserted id."});
        else {
          resolve(new Question(row.id, row.text, row.email, row.date));
        }
      });
    });
  }
  
  // add a new question
  export const addQuestion = (question) => {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT id from user WHERE email = ?';
      db.get(sql, [question.email], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({error: "Author not available, check the inserted email."});
        else {
          sql = 'INSERT INTO question(text, authorId, date) VALUES(?,?,DATE(?))';
          db.run(sql, [question.text, row.id, question.date.toISOString()], function (err) {
            if (err)
              reject(err);
            else
              resolve(this.lastID);
          });
        }
      });
    });
  }
  
  /** ANSWERS **/
  
  // get all the answer of a given question
  export const listAnswersOf = (questionId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT answer.*, user.email FROM answer JOIN user ON answer.authorId=user.id WHERE answer.questionId = ?';
      db.all(sql, [questionId], (err, rows) => {
        if (err)
          reject(err)
        else {
          const answers = rows.map((ans) => new Answer(ans.id, ans.text, ans.email, ans.date, ans.score));
          resolve(answers);
        }
      });
    });
  }
  
  // add a new answer
  export const addAnswer = (answer, questionId) => {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT id from user WHERE email = ?';
      db.get(sql, [answer.email], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({error: "Author not available, check the inserted email."});
        else {
          sql = "INSERT INTO answer(text, authorId, date, score, questionId) VALUES (?, ?, DATE(?), ?, ?)";
          db.run(sql, [answer.text, row.id, answer.date, answer.score, questionId], function (err) {
            if (err)
              reject(err);
            else
              resolve(this.lastID);
          });
        }
      });
    });
  }
  
  // update an existing answer
  export const updateAnswer = (answer) => {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT id from user WHERE email = ?';
      db.get(sql, [answer.email], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({error: "Author not available, check the inserted email."});
        else {
          sql = "UPDATE answer SET text = ?, authorId = ?, date = DATE(?), score = ? WHERE id = ?"
          db.run(sql, [answer.text, row.id, answer.date, answer.score, answer.id], function (err) {
            if (err)
              reject(err);
            else
              resolve(this.lastID);
          });
        }
      });
    });
  }
  
  // vote for an answer
  export const voteAnswer = (answerId, vote) => {
    return new Promise((resolve, reject) => {
      const delta = vote === 'upvote' ? 1 : -1;
      const sql = "UPDATE answer SET score = score + ? WHERE id = ?";
      db.run(sql, [delta, answerId], function (err) {
        if(err){
          reject(err);
        }
        else {
          resolve(this.changes) //restituisce il numero di righe modificate dalla query
        }
      });
    });
  }