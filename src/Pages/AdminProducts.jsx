import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import axios from '../Utils/axios'
import { Link } from "react-router-dom";

const ProductCards = () => {
  // Sample dummy data (replace with your actual product list)
  const [products , setProducts] = useState([]);

  useEffect(() => {
    const fetchProd = async () => {
        try {
            const res = await axios.get('/products');
            setProducts(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    fetchProd()
  }, [])

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product List</h2>
      <Row>
        {products.map((product) => (
          <Col md={4} sm={6} xs={12} key={product.id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`http://localhost:3000${product.image_url}`}
                alt={product.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                  {product.description.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                  <br />
                  <strong>Price:</strong> ${product.price}
                  <br />
                  <strong>Stock:</strong> {product.stock}
                </Card.Text>
                <Link to={`/updateProd/${product.id}`} variant="outline-primary">Update</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductCards;
