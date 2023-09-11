import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Coffee Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            <NavDropdown title="Actions" id="basic-nav-dropdown">
              <NavDropdown.Item href="/account_management">
                Cashier Account Management
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Daily Report
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Dashboard</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
