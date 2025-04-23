import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../Utils/axios";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductDetails() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null); // Single product data
  const [reviews, setReview] = useState([]); // Reviews for this product
  const [comment, setComment] = useState(""); // New comment input
  const { addToCart, cartItems, fetchCart } = useCart(); // Cart context
  const { user } = useAuth(); // Auth context (can be used for comment posting)

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch cart items on load
  useEffect(() => {
    fetchCart();
  }, []);

  // Add item to cart
  const handleAdd = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Added to cart!");
      fetchCart();
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // Fetch reviews after product is loaded
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axios.get(
          `/reviews/product/${product.id}`
        );
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    if (product) fetchAllReviews();
  }, [product]);

  // Get cart quantity for this product
  const getQuantityInCart = (productId) => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const handleReview = async (productId) => {
    try {
      await axios.post(`/reviews`, {
        product_id: productId,
        rating: 4,
        comment: comment,
      });
      setComment(""); // Clear the input box
      toast.success("Comment posted!");
      // Re-fetch reviews after posting
      const response = await axios.get(
        `/reviews/product/${productId}`
      );
      setReview(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // Loading spinner
  if (!product) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row align-items-center" style={{
        height: "100vh"
      }}>
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <img
            src={`http://localhost:3000${product.image_url}`}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "500px", objectFit: "contain" }}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2 className="fw-bold mb-3">{product.name}</h2>
    
          <h4 className="text-primary fw-bold mb-4">${product.price}</h4>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAdd(product.id)}
            className="btn btn-lg btn-primary w-100 mb-3"
          >
            {getQuantityInCart(product.id) > 0
              ? `In Cart (${getQuantityInCart(product.id)})`
              : "Add to Cart"}
          </button>

         

         
          {/* Stock Message */}
          <p className="text-success small">
            ✅ In stock — delivery in 3–5 business days
          </p>
          <p className="text-muted mb-3">{product.description}</p>
           {/* Comment Input */}
           <div className="mb-3">
            <h6 className="mb-2">Leave a Comment</h6>
            <textarea
              className="form-control mb-2"
              placeholder="Write a comment..."
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleReview(product.id)}
            >
              Post Comment
            </button>
          </div>

           {/* Comments List */}
           <div
            className="mb-3 p-3 rounded"
            style={{
              background: "#f8f9fa",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            <h6 className="small text-muted mb-2">Comments:</h6>
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <p key={rev.id} className="mb-2">
                  <strong>{rev.user_name}:</strong> {rev.comment}
                </p>
              ))
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
