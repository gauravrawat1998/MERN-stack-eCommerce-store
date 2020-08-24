import React, { useState, useEffect } from "react";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/CartHelper";
import StripeCheckout from "./StripeCheckout";
import BraintreePayment from "./BraintreePayment";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>Products</h2>
        {products.map((product, index) => {
          return (
            <Card
              key={index}
              product={product}
              addToCart={false}
              removeFromCart={true}
              setReload={setReload}
              reload={reload}
            />
          );
        })}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h2>This section for checkout</h2>
      </div>
    );
  };

  return (
    <Base title="Cart" description="Ready to checkout">
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-6 offset-3">
              {products.length > 0 ? (
                loadAllProducts(products)
              ) : (
                <h3>No Products In Cart</h3>
              )}
            </div>
          </div>
        </div>
        <div className="col-6">
          Payment Section
          {/* <StripeCheckout products={products} setReload={setReload} /> */}
          <BraintreePayment products={products} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
