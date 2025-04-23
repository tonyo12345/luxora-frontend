import React, { useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import axios from "../Utils/axios.jsx";
import { useParams, useNavigate } from "react-router-dom";

const ProdUpdate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        const product = response.data;

        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          category_id: product.category_id || "",
        });

        setSelectedCategoryId(product.category_id || "");
        setExistingImageUrl(`http://localhost:3000${product.image_url}` || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image file handler
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category_id", selectedCategoryId);
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product updated successfully");
      navigate("/adminProd"); // Redirect after update
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Update Product</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="productDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            name="description"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="productCategory">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">-- Select a Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="productPrice">
          <Form.Label>Price ($)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            name="price"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="productStock">
          <Form.Label>Stock Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter quantity"
            value={formData.stock}
            onChange={handleChange}
            name="stock"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="productImage">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
          {existingImageUrl && (
            <div className="mt-2">
              <Form.Text>Current Image:</Form.Text>
              <br />
              <Image
                src={existingImageUrl}
                alt="Current product"
                thumbnail
                style={{ maxWidth: "200px", marginTop: "5px" }}
              />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Product
        </Button>
      </Form>
    </div>
  );
};

export default ProdUpdate;
