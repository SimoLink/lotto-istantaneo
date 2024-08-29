import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavHeader from './components/NavHeader';
import Estrazione from './components/Estrazione';
import { Container } from 'react-bootstrap';
import FormScommessa from './components/FormScommessa';
import { useState } from 'react';

const fakeEstrazione = {
  id: 53,
  numero1: 20,
  numero2: 21,
  numero3: 22,
  numero4: 23,
  numero5: 24
}

const fakeBudget = 80;

function App() {
  const [puntata, setPuntata] = useState([]);

  const aggiungiPuntata = (newPuntata) => {
    setPuntata(oldPuntata => {return oldPuntata.concat(newPuntata)});
  }

  return (
    <>
      <NavHeader ></NavHeader>
      <Container fluid className='mt-3'>
        <Estrazione estrazione={fakeEstrazione} budget={fakeBudget}></Estrazione>
        <FormScommessa aggiungiPuntata={aggiungiPuntata}></FormScommessa>
      </Container>
    </>
  )
}

export default App