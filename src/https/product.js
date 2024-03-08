export const getProduct = async () => {
  const response = await fetch("http://localhost:3001/products", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const getProductById = async (id) => {
  const response = await fetch(`http://localhost:3001/products/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
