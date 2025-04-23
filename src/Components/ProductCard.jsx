import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const { addToCart, fetchCart, cartItems } = useCart();
  const { user } = useAuth();
  const [reviews, setReview] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchProducts();
  }, [user]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Added to cart!");
      fetchCart();
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const reviewsData = {};
        for (const product of products) {
          const response = await axios.get(
            `http://localhost:3000/api/reviews/product/${product.id}`
          );
          reviewsData[product.id] = response.data;
        }
        setReview(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    if (products.length > 0) fetchAllReviews();
  }, [products]);

  const getQuantityInCart = (productId) => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="container-fluid py-5">
      <h2 className="text-center fw-bold display-5 mb-5 text-primary">
        Shop Our Products
      </h2>
      <div className="row g-4">
        {products.length === 0 ? (
          <div className="text-center">Loading products...</div>
        ) : (
          products.map((product) => (
            <div className="col-md-6 col-lg-4 col-xl-3" key={product.id}>
              <div className="card h-100 border-0 shadow-sm">
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none"
                >
                  <img
                    src={`http://localhost:3000${product.image_url}`}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                </Link>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-semibold">{product.title}</h5>
                  <p className="card-text text-muted small truncate-text mb-2">
                    {product.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-primary">
                      ${product.price}
                    </span>
                    {/* Optionally show rating stars or stock */}
                  </div>

                  <div
                    className="bg-light rounded p-2 mb-3"
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                  >
                    <h6 className="small text-muted mb-1">Reviews:</h6>
                    {reviews[product.id] && reviews[product.id].length > 0 ? (
                      reviews[product.id].map((rev) => (
                        <p key={rev.id} className="small mb-1">
                          <strong>{rev.user_name}:</strong> {rev.comment}
                        </p>
                      ))
                    ) : (
                      <p className="text-muted small mb-0">No reviews yet.</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="btn btn-primary mt-auto w-100 rounded-pill"
                  >
                    {getQuantityInCart(product.id) > 0
                      ? `In Cart (${getQuantityInCart(product.id)})`
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
