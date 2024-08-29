import { Navbar, Container, Nav } from 'react-bootstrap';

function NavHeader() {
    return (
      <Navbar bg='warning' data-bs-theme="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="fs-1 fw-bold"> {/* fs-1 per un testo grande */}
            Lotto Istantaneo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="ms-auto">
              <Nav.Link href="#classifica" className="fs-4"> {/* fs-4 per un testo più grande */}
                Classifica
              </Nav.Link>
              <Nav.Link href="#login" className="fs-4"> {/* fs-4 per un testo più grande */}
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

export default NavHeader;