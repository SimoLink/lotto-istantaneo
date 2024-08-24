import sqlite from 'sqlite3';

//apertura del db
export const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});
