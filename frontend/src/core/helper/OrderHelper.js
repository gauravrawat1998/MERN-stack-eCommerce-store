const { API } = require("../../backend");

export const createOrder = (userId, token, orderData) => {
  console.log(userId, token, orderData);
  return fetch(`${API}/order/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order: orderData }),
  })
    .then((response) => {
      console.log("ORDER HELPER", response);
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};
