import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProductDetails from "./Pages/ProductDetails.jsx";
import ProductCard from "./Components/ProductCard.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx"; // Import AuthProvider
import Login from "./Pages/Login.jsx";
import Navbar from "./Components/NavBar.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Register from "./Pages/RegisterPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import ViewCart from "./Pages/ViewCart.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadersAnimation from "./Components/LoadersAnimation.jsx";
import { useAuth } from "./Context/AuthContext.jsx";
import AddProductForm from "./Admin/AddProduct.jsx";
import AdminRoute from "./Components/AdminRoute.jsx";
import EditProfile from "./Pages/EditProfile.jsx"
import ProductCards from "./Pages/AdminProducts.jsx";
import UpdateProd from "./Pages/UpdateProduct.jsx";
import ProdUpdate from "./Pages/ProdUpdate.jsx";
import CheckOut from "./Pages/CheckOut.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import AdminViewAllOrders from "./Pages/AdminViewAllOrders.jsx";

function App() {
  return (
    <Router>
      {" "}
      {/* Router must wrap AuthProvider */}
      <AuthProvider>
        {" "}
        {/* AuthProvider now has access to Router context */}
        <CartProvider>
          {/* <AuthContent /> */}
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Public route for product details */}
            <Route
              path="/product/:id"
              element={
                <PrivateRoute>
                  <ProductDetails />
                </PrivateRoute>
              }
            />

            {/* Protected route for the home page */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <ProductCard />
                </PrivateRoute>
              }
            />

            {/* Login route */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <ViewCart />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/addProduct"
              element={
                <AdminRoute>
                  <AddProductForm />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/allorders"
              element={
                <AdminRoute>
                  <AdminViewAllOrders />
                </AdminRoute>
              }
            ></Route>
            <Route path="/editProfile" element={
              <PrivateRoute>
              <EditProfile/>
              </PrivateRoute>
            }></Route>
            <Route path="/adminProd" element={
              <PrivateRoute>
                <ProductCards/>
              </PrivateRoute>
            } />
             <Route path="/updateProd/:id" element={
              <PrivateRoute>
                <UpdateProd/>
              </PrivateRoute>
            } />
             <Route path="/prodUpdate/:id" element={
              <PrivateRoute>
                <ProdUpdate/>
              </PrivateRoute>
            } />
             <Route path="/checkout" element={
              <PrivateRoute>
                <CheckOut/>
              </PrivateRoute>
            } />
             <Route path="/myorders" element={
              <PrivateRoute>
                <MyOrders/>
              </PrivateRoute>
            } />
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

function AuthContent() {
  const { loading } = useAuth(); // Now inside the AuthProvider context

  return loading ? "Logging Out Please wait..." : null;
}

export default App;
