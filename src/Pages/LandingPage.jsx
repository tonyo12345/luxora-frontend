import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import landing from "../assets/modern.jpeg";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const LandingPage = () => {
  const { user } = useAuth();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, [user]);

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <header
        className="text-white d-flex align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${landing})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold">Luxora Furniture</h1>
          <p className="lead fs-4">Where lifestyle meets luxury.</p>
          <a
            href="#products"
            className="btn btn-outline-light btn-lg mt-4 px-5"
          >
            Shop Now
          </a>
        </div>
      </header>
      {/* Category Section */}
      <section className="py-5 bg-white">
        <div className="container-fluid px-0">
          <div className="row g-0">
            {product.slice(0, 4).map((cat) => (
              <div key={cat.id} className="col-6" style={{ border: "1px solid black"}}>
                <div
                  className="position-relative"
                  style={{
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`http://localhost:3000${cat.image_url}`}
                    alt={`Category ${cat.id}`}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-5">
        <div className="container mt-4">
          <h2 className="text-center mb-5 fw-semibold">Featured Products</h2>
          <div className="row g-4">
            {product.slice(0, 6).map((item) => (
              <div key={item.id} className="col-sm-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src={`http://localhost:3000${item.image_url}`}
                    alt={item.title}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "10px 10px 0 0",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x220?text=No+Image";
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{item.title}</h5>
                    <p className="text-muted mb-2">${item.price}</p>
                    <a
                      href={`/product/${item.id}`}
                      className="btn btn-outline-primary mt-auto"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-5">
        <div className="container text-center">
          <h2 className="mb-4 fw-semibold">About Us</h2>
          <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
            At Luxora, we merge comfort and aesthetics to help you craft a space
            that reflects your personal style. Our handpicked selection ensures
            quality, elegance, and sophistication.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4 fw-semibold">Contact Us</h2>
          <p className="lead">
            Questions or feedback? We'd love to hear from you!
          </p>
          <div className="d-flex flex-column align-items-center">
            <p>
              <strong>Email:</strong> info@luxorafurniture.com
            </p>
            <p>
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} Luxora Furniture
          </p>
          <small>Designed with passion and crafted with love.</small>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
