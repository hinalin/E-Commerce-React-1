import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../components/NotFound";
import "./productdetails.css";
import { createCart, getCartItem } from "../https/cart";
import { getProductById } from "../https/product";

const ProductDetails = ({ setCartItems, cartItems }) => {
  const [product, setProduct] = useState(null);
  const [isShowAddCart, setIsShowAddCart] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    const { id, ...productWithoutId } = product;
    const updatedCart = { ...productWithoutId, productId: id };
    const updateCart = await createCart(updatedCart);
    setCartItems((prev) => [...prev, ...updateCart]);
    setIsShowAddCart(true);
    // console.log(productWithoutId , "productWithoutId ....................");
  };

  const handleIncrement = async () => {
    const updatedCartItems = cartItems.map((item) => {
      if (Number(item.productId) === Number(id)) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    await updateCart(updatedCartItems);
    const data = await getCartItem();
    setCartItems(data);
  };

  const handleDecrement = async () => {
    const updatedCartItems = cartItems.map((item) => {
      if (Number(item.productId) === Number(id) && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    await updateCart(updatedCartItems); // Update cart items using API
    const data = await getCartItem();
    setCartItems(data);
  };

  const updateCart = async (updatedCartItems) => {
    try {
      for (const cartItem of updatedCartItems) {
        if (Number(cartItem.productId) === Number(id)) {
          await axios.patch(
            `http://localhost:3001/cart/${cartItem.id}`,
            cartItem
          );
        }
      }
      console.log("Cart items updated successfully:", updatedCartItems);
    } catch (error) {
      console.error("Error updating cart items:", error);
    }
  };

  const quantityInCart =
    cartItems.find((item) => Number(item.productId) === Number(id))?.quantity ||
    0;

  useEffect(() => {
    if (quantityInCart) {
      setIsShowAddCart(true);
    }
  });
  console.log(cartItems, "original cart item");
  if (!product) {
    return <NotFound />;
  }

  return (
    <>
      <div className="container">
        <div className="product-details d-flex">
          <img src={product.image} alt={product.name} className="product-img" />
          <div className="product-info">
            <h3>{product.name}</h3>
            <h6>Color: {product.color}</h6>
            <h6>Size: {product.size}</h6>
            <h6>Price: ₹ {product.price}</h6>
            <h5>Other Details:</h5>
            <p>{product.details}</p>
          </div>
        </div>

        <div className="cart-buttons mt-4">
          {isShowAddCart ? (
            <div>
              <div className="inc-dec-count d-flex">
                <button
                  className="btn count-btn decrease-count"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <button className="btn count-btn show-count">
                  {quantityInCart}
                </button>
                <button
                  className="btn count-btn increase-count"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
              <button className="btn cart-btn buy-now-btn">Buy Now</button>
            </div>
          ) : (
            <div>
              <button
                className="btn cart-btn add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
              <button className="btn cart-btn buy-now-btn">Buy Now</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
