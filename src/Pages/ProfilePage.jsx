import { useState, useEffect } from "react";
import React from "react";
import axios from "../Utils/axios";
import { useAuth } from "../Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
// import defaultCover from "../assets/cover.jpg"; // Add a cover image in public or assets
// import defaultProfile from "../assets/avatar.png"; // Optional default avatar

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(`/users/${user.id}`);
          setProfile(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (!profile) return <div className="text-center py-5">Loading profile...</div>;

  return (
    <div className="container py-4">
      <div className="position-relative mb-5">
        <img
          src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
          alt="cover"
          className="w-100 rounded shadow"
          style={{ height: "250px", objectFit: "cover" }}
        />
        <div
          className="position-absolute"
          style={{
            bottom: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <img
            src="https://pcgg.gov.ph/wp-content/uploads/2024/02/Profile-Placeholder.jpg"
            alt="profile"
            className="rounded-circle border border-3 border-white shadow"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>
      </div>

      <div className="card shadow-lg mt-5 p-4">
        <div className="text-center mb-3">
          <h3 className="fw-bold mb-1">{profile.name}</h3>
          <p className="text-muted mb-0">{profile.role}</p>
          <small className="text-secondary">
            Joined on {new Date(profile.created_at).toLocaleDateString()}
          </small>
        </div>

        <hr />

        <div className="row text-center mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <h6 className="fw-bold">Email</h6>
            <p className="text-muted">{profile.email}</p>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold">Phone</h6>
            <p className="text-muted">
              {profile.address?.phone_number || "Not Provided"}
            </p>
          </div>
        </div>

        {profile.address && (
          <>
            <h5 className="fw-bold">Address</h5>
            <div className="bg-light rounded p-3 mb-3">
              <p className="mb-1">{profile.address.address_line}</p>
              <p className="mb-1">
                {profile.address.city}, {profile.address.state}{" "}
                {profile.address.postal_code}
              </p>
              <p className="mb-0">{profile.address.country}</p>
            </div>
          </>
        )}

        <div className="d-flex justify-content-between">
          <Link to="/editProfile" className="btn btn-primary w-50 me-2">
            Edit Profile
          </Link>
          <button
            className="btn btn-outline-danger w-50"
            onClick={() => alert("Logging out...")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
