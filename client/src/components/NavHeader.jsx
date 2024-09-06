import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavHeader() {
    return (
      <Navbar bg='warning' data-bs-theme="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <Link className="fs-1 fw-bold" style={{ color: 'black', textDecoration: 'none' }} to="/homepage">Lotto Istantaneo</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/classifica" className="fs-4">
                Classifica
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="fs-4">
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

export default NavHeader;