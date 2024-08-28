import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavHeader from './NavHeader';
import Estrazione from './Estrazione';
import { Container } from 'react-bootstrap';

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

  return (
    <>
      <NavHeader ></NavHeader>
      <Container fluid className='mt-3'>
        <Estrazione estrazione={fakeEstrazione} budget={fakeBudget}></Estrazione>
      </Container>
    </>
  )
}

export default App