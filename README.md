[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HF0PzDJs)
# Exam #3: "Lotto Istantaneo"
## Student: s331059 FENECH SIMONE 

## React Client Application Routes

- Route `/`: home page del sito che mostra l'estrazione corrente e il form per una nuova scommessa.
- Route `/classifica`: contiene una tabella che mostra i primi 3 utenti con più punti.
- Route `/login`: pagina di login contenente le regole del gioco.
- Route `/*`: pagina 404 not found.

## API Server

- GET `/api/sessions/current`
  - request parameters: credenziali per l'autenticazione con password
  - request body: _None_
  - response body content: Restituisce le informazioni dell'utente loggato.

  ``` JSON
  {
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
  }
  ```

  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
- POST `/api/sessions`
  - request parameters: _None_
  - request body: 
  ``` JSON
  {
    "username": "username",
    "password": "password"
  }
  ```
  - response body content: Restituisce le informazioni dell'utente loggato.

  ``` JSON
  {
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
  }
  ```

  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
- DELETE `/api/sessions/current`
  - request parameters: credenziali per l'autenticazione con password
  - request body: _None_
  - response body content: _None_
  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
- POST `/api/puntate`
  - request parameters: _None_
  - request body: 
  ``` JSON
  {
    "idUser": 1,
    "puntata1": 13,
    "puntata2": 1,
    "puntata3": 60
  }
  ```
  - response body content: Conferma l'inserimento della puntata.

  ``` JSON
  {
  "idUtente": 1,
  "idEstrazione": 10,
  "puntata1": 13,
  "puntata2": 1,
  "puntata3": 60,
  "totalePuntate": 15
  }
  ```

  - response status: `201 Created` (success), `500 Internal Server Error` (generic error), `400 Bad Request` (invalid request)
- GET `/api/estrazioneCorrente`
  - request parameters: _None_
  - request body: _None_
  - response body content: Restituisce i numeri dell'ultima estrazione.

  ``` JSON
  {
  "id": 10,
  "numero1": 5,
  "numero2": 18,
  "numero3": 22,
  "numero4": 35,
  "numero5": 41
  }
  ```

  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
- GET `/api/classifica`
  - request parameters: _None_
  - request body: _None_
  - response body content: Restituisce i primi 3 giocatori con i loro punti.

  ``` JSON
  [
  {
    "username": "topolino",
    "punti": 150
  },
  {
    "username": "paperino",
    "punti": 140
  },
  {
    "username": "pippo",
    "punti": 130
  }
  ]
  ```

  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
- GET `/api/utenti/:idUtente/punti`
  - request parameters: idUtente
  - request body: _None_
  - response body content: Restituisce il numero di punti disponibili per l'utente.

  ``` JSON
  {
    "username": "topolino",
    "punti": 150
  }
  ```
  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
- PUT `/api/puntate/risultato`
  - request parameters: _None_
  - request body: 
  ``` JSON
  {
    "idUtente": 1,
    "idEstrazione": 1
  }
  ```
  - response body content: Conferma il risultato della puntata.

  ``` JSON
  {
    "puntiVinti": 20
  }
  ```

  - response status: `200 OK` (success), `500 Internal Server Error` (generic error), `400 Bad Request` (invalid request)
- POST `/api/estrazioni`
  - request parameters: _None_
  - request body: 
  ``` JSON
  {
    "numero1": 7,
    "numero2": 14,
    "numero3": 23,
    "numero4": 35,
    "numero5": 48
  }
  ```
  - response body content: Conferma l'inserimento della nuova estrazione e restituisce l'id dell'estrazione appena creata.

  ``` JSON
  {
  "idEstrazione": 10
  }
  ```

  - response status: `201 Created` (success), `500 Internal Server Error` (generic error), `400 Bad Request` (invalid request)

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
