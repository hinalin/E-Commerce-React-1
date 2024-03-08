import React, { useEffect , useState } from "react";
import "./addToCart.css";
import EmptyCart from "../assets/logo/emptycart.gif";
import axios from "axios";
import ProductDetails from "./productdetails";
import { BrowserRouter , Link } from "react-router-dom";

function AddToCartPage({ cartItems, setCartItems }) {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate total items and total price when cartItems change
    let itemsCount = 0;
    let itemsPrice = 0;
    for (const item of cartItems) {
      itemsCount += item.quantity;
      itemsPrice += item.price * item.quantity;
    }
    setTotalItems(itemsCount);
    setTotalPrice(itemsPrice);
  }, [cartItems]);
 
  useEffect(
    () => {
      axios
        .get(`http://localhost:3001/cart`)
        .then((a) => {
          setCartItems(a.data);
          console.log(a.data);
          console.log("cart>>>>>>>>>>>>>>>>>>>>." + JSON.stringify(a.data));
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .delete(`http://localhost:3001/cart/1000`)
        .then(() => {
          axios
            .get(`http://localhost:3001/cart`)
            .then((response) => {
              setCartItems(response.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [setCartItems]
  );

  const DeleteItem = (id) => {
    console.log(
      "Deleting item with productId:================================",
      id
    );

    axios
      .delete(`http://localhost:3001/cart/${id}`)
      .then(() => {
        axios
          .get(`http://localhost:3001/cart`)
          .then((response) => {
            setCartItems(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const changeQuantity = (id, newQuantity) => {
    axios
      .patch(`http://localhost:3001/cart/${id}`, { quantity: newQuantity })
      .then(() => {
        axios
          .get(`http://localhost:3001/cart`)
          .then((response) => {
            setCartItems(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(cartItems);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      changeQuantity(id, newQuantity);
    }
  };

  
  return (
    <>
      <div className="cart-items row gx-0">
        {cartItems.length === 0 ? (
          <img src={EmptyCart} alt="Empty Cart" className="empty-cart-image" />
        ) : (
          <ul>
            {cartItems.map((item) => (
              <div className="cart-products" key={item.productId}>
                <div key={item.productId} className="col-11  d-flex">
                  <Link to={`/ProductDetails/${item.productId}`}>
                    <div className="cart-product-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-product-img"
                      />
                    </div>
                  </Link>
                  <div className="cart-product-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size}</p>
                    <p>Price: ₹ {item.price}</p>
                    {/* <p>Quantity : {product.quantity}</p> */}
                    <div className="d-flex">
                      <button
                        className="btn quantity-btn quantity-increase"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <button className="btn quantity-btn quantity-count">
                        {item.quantity}
                      </button>
                      <button
                        className="btn quantity-btn quantity-descrease"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-remove-btn">
                      <button
                        className="btn cart-remove-btn btn-danger mt-3"
                        onClick={() => DeleteItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
      <div className="cart-item-total d-flex justify-content-between w-100">
          <div className="total-item d-flex">
            <h4>Total items : </h4>
            <h4>&nbsp; {totalItems}</h4>
          </div>
          <div className="total-price d-flex">
            <h4>Total Price :</h4>
            <h4> &nbsp;₹{totalPrice}</h4>
          </div>
      </div>
    </>
  );
}

export default AddToCartPage;