import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "../Utils/axios.jsx";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/categories`);
        console.log(res.data);
        setCategories(res.data);
      } catch (error) {}
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sync the selected category to formData
    const updatedFormData = {
      ...formData,
      category_id: selectedCategoryId,
    };

    const data = new FormData();
    data.append("title", updatedFormData.title);
    data.append("description", updatedFormData.description);
    data.append("price", updatedFormData.price);
    data.append("stock", updatedFormData.stock);
    data.append("category_id", updatedFormData.category_id); // ✅ Correct now
    data.append("image", image);

    try {
      await axios.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product created successfully");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Add New Product</h2>
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
          <Form.Control
            as="select"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            required
          >
            <option value="">-- Select a Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
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
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Product
        </Button>
      </Form>
    </div>
  );
};

export default AddProductForm;
