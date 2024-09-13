import 'bootstrap/dist/css/bootstrap.min.css';
import NavHeader from './components/NavHeader';
import { Alert, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Navigate} from "react-router-dom";
import NotFound from './components/NotFound';
import TabellaClassifica from './components/TabellaClassifica';
import API from './API.mjs';
import EstrazioneLayout from './components/EstrazioneLayout';
import {LoginForm} from './components/FormAutenticazione';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

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

const handleLogin = async (credentials) => {
  try {
    const user = await API.logIn(credentials);
    setLoggedIn(true);
    setMessage({msg: `Benvenuto, ${user.username}!`, type: 'success'});
    setUser(user);
  }catch(err) {
    setMessage({msg: err, type: 'danger'});
  }
};

const handleLogout = async () => {
  await API.logOut();
  setLoggedIn(false);
  setMessage('');
};

  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
            <Container fluid className='mt-3'>
              {message && (
                <Row>
                  <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                </Row>
              )}
              <Outlet/>
            </Container>
        </>
      }>

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

      <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
      }/>
      </Route>

    </Routes>
  )
}

export default App