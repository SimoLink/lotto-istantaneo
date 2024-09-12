import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './FormAutenticazione';

function NavHeader(props) {
    return (
      <Navbar bg='warning' data-bs-theme="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <Link className="fs-1 fw-bold" style={{ color: 'black', textDecoration: 'none' }} to="/">Lotto Istantaneo</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="ms-auto">
              {props.loggedIn && 
                <Nav.Link as={Link} to="/classifica" className="fs-4">
                  Classifica
                </Nav.Link>}
              {props.loggedIn ? 
                <LogoutButton logout={props.handleLogout} /> :
                <Nav.Link as={Link} to="/login" className="fs-4">
                  Login
                </Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

export default NavHeader;