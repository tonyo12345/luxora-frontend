//should display all orders of the user
//can be used to view order history
//can be used to reorder the order
//when the user clicks order, the order will be saved and the user will be redirected to the cart page
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../Utils/axios.jsx"; // Pre-configured Axios instance
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders/my-orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "1000px" }}>
        <h2 className="text-center mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>image</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id || index}>
                  <td>{order.title}</td>
                  <td>
                    <img
                      src={`http://localhost:3000${order.image_url}`}
                      alt={order.title}
                      style={{ width: "50px", height: "40px" }}
                    />
                  </td>
                  <td>${order.total_price}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
