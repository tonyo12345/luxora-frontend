import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

export default function ViewCart() {
  const { cartItems, fetchCart, updateCart, removeItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = (quantity, price) => {
    return quantity * price;
  };

  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + totalPrice(item.quantity, item.price),
    0
  );

  // ✅ This function adds 1 item to the current quantity
  const addItem = async (productId, currentQuantity) => {
    try {
      const newQuantity = currentQuantity + 1;
      await updateCart(productId, newQuantity); // Send PUT request to update quantity
      await fetchCart(); // Refresh the cart from backend
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const decreaseItem = async (productId, currentQuantity) => {
    try {
      const newQuantity = currentQuantity - 1;
      if (newQuantity <= 0) {
        removeItem(productId);
        await fetchCart();
        return; // exit the function here!
      }
      await updateCart(productId, newQuantity); // Send PUT request to update quantity
      await fetchCart(); // Refresh the cart from backend
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  return (
    <div className="container py-5" style={{
      height: "100vh",
      marginTop: "50px",
      width: "100%"
    }}>
      <h2 className="mb-4 text-center fw-bold text-primary">Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-muted">Your cart is empty.</div>
      ) : (
        <>
          <div className="row g-4">
            {cartItems.map((item) => (
              <div
                className="col-12 col-md-5" // Fixed column layout
                key={item.id}
                style={{ display: 'flex', justifyContent: 'center', width:"400px"}} // Centering each card
              >
                <div
                  className="card h-100 shadow-sm border-0 rounded-3"
                  style={{ width: "300px" }} // Fixed width for each card
                >
                  <img
                    src={`http://localhost:3000${item.image_url}`}
                    alt={item.title}
                    className="card-img-top rounded-3"
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-muted small">
                      {item.description}
                    </p>

                    <p className="mb-2">
                      <strong>Price:</strong> ${item.price}
                    </p>

                    <div
                      className="d-flex align-items-center gap-3 mb-3"
                      style={{ justifyContent: "space-between" }}
                    >
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        style={{ width: "40px" }}
                        onClick={() => decreaseItem(item.product_id, item.quantity)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        style={{ width: "40px" }}
                        onClick={() => addItem(item.product_id, item.quantity)} // Pass product ID and current quantity
                      >
                        +
                      </button>
                    </div>

                    <p className="fw-bold mt-auto">
                      Subtotal: $
                      {totalPrice(item.quantity, item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="text-end">
            <h4 className="fw-bold text-primary">Total: ${totalCartAmount.toFixed(2)}</h4>
            <button className="btn btn-success mt-3 rounded-pill px-4 py-2">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
