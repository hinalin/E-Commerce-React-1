import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Productlist from "../pages/productlist";
import ProductDetails from "../pages/productdetails";
import Navbar from "../components/Navbar";
import AddToCartPage from "../pages/addToCart";
import { getCartItem } from "../https/cart";

function Main() {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const cartData = await getCartItem();
      setCartItems(cartData);
    };
    fetchData();
  }, []);
  return (
    <>
      <Router>
        <Navbar cartItems={cartItems.length}/>
        <Routes>
          <Route path="/" element={<Productlist />}></Route>
          <Route
            path="/productdetails/:id"
            element={
              <ProductDetails
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            }
          ></Route>
          <Route
            path="/addToCart"
            element={
              <AddToCartPage
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default Main;
