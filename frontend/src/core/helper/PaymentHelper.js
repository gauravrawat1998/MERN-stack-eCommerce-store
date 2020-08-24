import { API } from "../../backend";

export const getMeToken = (userId, token) => {
  // console.log(userId, token);
  return fetch(`${API}/payment/gettoken/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const processPayment = (userId, token, paymentInfo) => {
  return fetch(`${API}/payment/braintree/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentInfo),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};
