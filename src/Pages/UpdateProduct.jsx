import React, { useState, useEffect } from "react";
import {
    Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "../Utils/axios";

const UpdateProd = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);

        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/products/${id}`);
      alert("Deleted successfully");
      navigate("/adminProd");
    } catch (err) {
      alert("Error deleting product");
      console.error(err);
    }
  };

  return (
    <div className="card mx-auto my-4 shadow" style={{ maxWidth: "400px" }}>
      <img
        src={`http://localhost:3000${product?.image_url}`}
        className="card-img-top"
        alt={product?.name}
        style={{ height: "300px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{product?.title}</h5>
        <p className="card-text text-muted">{product?.description}</p>
        <p className="card-text fw-bold text-success">${product?.price}</p>
        <div className="d-flex justify-content-end gap-2">
          <Link to={`/prodUpdate/${product?.id}`} className="btn btn-primary">Update</Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProd;
