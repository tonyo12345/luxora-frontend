import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Card,
} from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import axios from "../Utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`/address/${user.id}`);
        setAddress(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAddress();
  }, [user.id]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/address/${user.id}`, address);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow border-0 overflow-hidden">
        {/* Cover Photo */}
        <div
          style={{
            height: "200px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1470&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Profile Header */}
        <div className="text-center mt-n5">
          <Image
            src="https://images.immediate.co.uk/production/volatile/sites/3/2025/03/solo-levelling-season-2-finale-993c204.jpg?quality=90&resize=980,654"
            roundedCircle
            width="120"
            height="120"
            className="border border-white shadow"
          />
          <h4 className="mt-2 fw-bold">{user.name}</h4>
          <p className="text-muted">{user.email}</p>
        </div>

        <Card.Body className="px-4 py-4">
          <h5 className="fw-bold mb-3">Personal Details</h5>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control value={user.name} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control value={user.email} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control value={user.role} disabled />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          <h5 className="fw-bold mb-3">Address Information</h5>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Address Line</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_line"
                    value={address?.address_line || ""}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={address?.city || ""}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={address?.state || ""}
                    onChange={handleChange}
                    placeholder="NY"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postal_code"
                    value={address?.postal_code || ""}
                    onChange={handleChange}
                    placeholder="10001"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={address?.country || ""}
                    onChange={handleChange}
                    placeholder="USA"
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={address?.phone_number || ""}
                    onChange={handleChange}
                    placeholder="+1 123 456 7890"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button type="submit" variant="primary" className="px-4">
                Update Profile
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
