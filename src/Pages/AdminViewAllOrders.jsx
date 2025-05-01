import React, { useEffect, useState } from "react";
import axios from "../Utils/axios.jsx"; // Pre-configured Axios instance
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminViewAllOrders() {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Group orders by user
  useEffect(() => {
    const group = {};
    orders.forEach((order) => {
      if (!group[order.user_id]) {
        group[order.user_id] = {
          userName: order.user_name,
          userId: order.user_id,
          orders: [],
        };
      }
      group[order.user_id].orders.push(order);
    });
    setGroupedOrders(group);
  }, [orders]);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">All Orders (Grouped by User)</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        Object.values(groupedOrders).map((userGroup) => (
          <div key={userGroup.userId} className="mb-5">
            <h4 className="mb-3">
              User: {userGroup.userName} (ID: {userGroup.userId})
            </h4>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Price at Purchase</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {userGroup.orders.map((order) => (
                  <tr key={order.order_id + "-" + order.product_id}>
                    <td>{order.order_id}</td>
                    <td>{order.product_title}</td>
                    <td>
                      <img
                        src={`http://localhost:3000${order.product_image}`}
                        alt={order.product_title}
                        style={{ width: "50px", height: "40px", objectFit: "cover" }}
                      />
                    </td>
                    <td>{order.quantity}</td>
                    <td>${order.price_at_purchase}</td>
                    <td>{order.status}</td>
                    <td>${order.total_price}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
