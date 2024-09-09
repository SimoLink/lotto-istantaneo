const SERVER_URL = 'http://localhost:3001';

const getClassifica = async () => {
    const response = await fetch(SERVER_URL + '/api/classifica');
    if(response.ok) {
        const classificaJson = await response.json();
        return classificaJson.map(row => ({ username: row.username, punti: row.punti }));
    }
    else 
        throw new Error('Internal Server Error');
    }

const getEstrazione = async () => {
    const response = await fetch(SERVER_URL + '/api/estrazioneCorrente');
    if(response.ok) {
        const estrazioneJson = await response.json();
        return estrazioneJson;
    }
    else 
        throw new Error('Internal Server Error');
    }

const aggiungiPuntata = async (puntata) => {
    const response = await fetch(SERVER_URL + '/api/puntate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({idUtente: puntata.idUtente, idEstrazione: puntata.idEstrazione, puntata1: puntata.puntata1, puntata2: puntata.puntata2, puntata3: puntata.puntata3}),
    });

    if(!response.ok) {
        const errMessage = await response.json();
        throw errMessage;
        }
    else 
        return null;
    }

    const controlloPuntata = async (idUtente, idUltimaEstrazione) => {
        const response = await fetch(SERVER_URL + '/api/controlloPuntata/' + idUltimaEstrazione + '/' + idUtente);
        if(response.ok) {
            const controlloPuntataJson = await response.json();
            return controlloPuntataJson;
        }
        else 
            throw new Error('Internal Server Error');
        }

    /*const controlloPuntata = async (idUtente, idUltimaEstrazione) => {
        const response = await fetch(SERVER_URL + '/api/controlloPuntata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({idUtente: idUtente, idEstrazione: idUltimaEstrazione}),
        });
        if(response.ok) {
            const controlloPuntataJson = await response.json();
            return controlloPuntataJson;
        }
        else 
            throw new Error('Internal Server Error');
        }*/

        const notificaVincita = async (idUtente) => { //MODIFICA APPENA INTRODUCI LOGIN
            const response = await fetch(SERVER_URL + '/api/notificaVincita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({idUtente: idUtente}),
            });
            if(response.ok) {
                const notificaVincitaJson = await response.json();
                return notificaVincitaJson;
            }
            else 
                throw new Error('Internal Server Error');
            }

            const notificaLetta = async (idUtente) => {
                const response = await fetch(SERVER_URL + '/api/notificaLetta', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({idUtente: idUtente}),
                });
                if(response.ok) {
                    //const notificaLettaJson = await response.json();
                    return true;
                }
                else 
                    throw new Error('Internal Server Error');
                }

                const getPunti = async (idUtente) => {
                    const response = await fetch(SERVER_URL + '/api/utenti/' + idUtente + '/punti');
                    if(response.ok) {
                        const puntiJson = await response.json();
                        return puntiJson;
                    }
                    else 
                        throw new Error('Internal Server Error');
                    }

const API = { getClassifica, getEstrazione, aggiungiPuntata, controlloPuntata, notificaVincita, notificaLetta, getPunti };
export default API;