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

const API = { getClassifica, getEstrazione };
export default API;