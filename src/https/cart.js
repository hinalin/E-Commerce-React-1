export const getCartItem = async () => {
  const response = await fetch("http://localhost:3001/cart", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const createCart = async (cartData) => {
  const response = await fetch("http://localhost:3001/cart", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(cartData),
  });
  const data = await response.json();
  return data;
};
