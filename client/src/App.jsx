import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavHeader from './components/NavHeader';
import Estrazione from './components/Estrazione';
import { Alert, Container, Row } from 'react-bootstrap';
import FormScommessa from './components/FormScommessa';
import { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Navigate} from "react-router-dom";
import NotFound from './components/NotFound';
import TabellaClassifica from './components/TabellaClassifica';
import API from './API.mjs';
import MessaggioNotifica from './components/MessaggioNotifica';
import EstrazioneLayout from './components/EstrazioneLayout';
import {LoginForm} from './components/FormAutenticazione';

/*const fakeEstrazione = {
  id: 53,
  numero1: 20,
  numero2: 21,
  numero3: 22,
  numero4: 23,
  numero5: 24
}*/

  /*const classifica = [
    { username: 'topolino', punti: 150 },
    { username: 'paperino', punti: 140 },
    { username: 'pippo', punti: 130 }
  ];*/

//const fakeBudget = 80;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

 // NEW
 useEffect(() => {
  const checkAuth = async () => {
    try {
    const user = await API.getUserInfo(); // we have the user info here
    setLoggedIn(true);
    setUser(user);
    } catch(err) {
      
    }
  };
  checkAuth();
}, []);

// NEW
const handleLogin = async (credentials) => {
  try {
    const user = await API.logIn(credentials);
    setLoggedIn(true);
    setMessage({msg: `Welcome, ${user.username}!`, type: 'success'});
    setUser(user);
  }catch(err) {
    setMessage({msg: err, type: 'danger'});
  }
};

// NEW
const handleLogout = async () => {
  await API.logOut();
  setLoggedIn(false);
  // clean up everything
  setMessage('');
};

  return (
    <Routes>
      <Route element={
      <>
      {/* UPDATED */}
      <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          {/* NEW */}
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Outlet/>
        </Container>
      </>
      } >
      <Route path="/" element={
        !loggedIn ? <Navigate replace to='/login' /> :
        <EstrazioneLayout loggedIn={loggedIn} user={user}></EstrazioneLayout>
      }/>
      <Route path="/classifica" element={
        !loggedIn ? <Navigate replace to='/login' /> : <TabellaClassifica loggedIn={loggedIn}></TabellaClassifica>
      }/>
      <Route path="*" element={
        <NotFound></NotFound>
      }/>
      {/* NEW */}
      <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />
      </Route>
    </Routes>
  )
}

export default App