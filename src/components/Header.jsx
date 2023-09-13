import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { SVGLogOut } from "./SVG/SVGLogOut";
import { userLogout } from "../redux/middlewares/auth-middleware";
import "../pages/Adminpages/style.css";

export const Header = () => {
  const userSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logout = async () => {
    await dispatch(userLogout());
    window.location.reload();
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Coffee Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href={
                userSelector?.id === 1
                  ? "/admin/landing_page"
                  : userSelector?.id === 2
                  ? "/cashier/landing_page"
                  : null
              }
            >
              Home
            </Nav.Link>
            <NavDropdown title="Actions" id="basic-nav-dropdown">
              <NavDropdown.Item
                href="/account_management"
                className="d-xxs-smallfont"
              >
                Cashier Account Management
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2" className="d-xxs-smallfont">
                Daily Report
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3" className="d-xxs-smallfont">
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4" className="d-xxs-smallfont">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <div onClick={logout} type="button">
            <SVGLogOut />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
