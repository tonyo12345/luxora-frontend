import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Image,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import { useCart } from "../Context/CartContext";

const NavbarComponent = () => {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const { fetchCart, cartItems } = useCart();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);
  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);
  const navLinkClass = ({ isActive }) =>
    `px-3 nav-link ${isActive ? "active-link fw-bold" : ""}`;

  return (
    <Navbar expand="lg" fixed="top" className="glass-navbar w-100">
      <div className="container">
        <Navbar.Brand as={NavLink} to="/" className="fs-3 fw-bold text-primary">
          LOXURA
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={NavLink} to="/" className={navLinkClass}>
              Home
            </Nav.Link>

            {isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/home" className={navLinkClass}>
                  Shop
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/cart"
                  className="position-relative px-3"
                >
                  <i className="bi bi-cart fs-5"></i>
                  {/* Optional: Add badge count here */}
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className="d-flex align-items-center px-3"
                >
                  <Image
                    src="https://pcgg.gov.ph/wp-content/uploads/2024/02/Profile-Placeholder.jpg"
                    roundedCircle
                    width="32"
                    height="32"
                    alt="profile"
                    className="me-2 border border-secondary-subtle"
                  />
                </Nav.Link>

                <Button
                  variant={loading ? "danger" : "outline-danger"}
                  size="sm"
                  className={`ms-2 px-3 d-flex align-items-center gap-2 ${
                    loading ? "disabled" : ""
                  }`}
                  onClick={!loading ? logout : undefined}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {loading ? "Logging Out..." : "Logout"}
                </Button>
              </>
            )}

            {!isLoggedIn && (
              <Nav.Link as={NavLink} to="/login" className={navLinkClass}>
                Login
              </Nav.Link>
            )}

            {isLoggedIn && user?.role === "admin" && (
              <NavDropdown title="Admin" id="admin-dropdown" align="end">
                <NavDropdown.Item
                  as={NavLink}
                  to="/admin-dashboard"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/adminProd"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Manage Products
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/addProduct"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  New Product
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  as={NavLink}
                  to="/settings"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Settings
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;
