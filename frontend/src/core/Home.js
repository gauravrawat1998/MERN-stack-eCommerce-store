import React, { useState, useEffect } from "react";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { getAllProducts } from "./helper/coreapicalls";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProducts = () => {
    getAllProducts().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  return (
    <Base title="Home" description="Welcome to the tshirt store">
      <div className="row">
        {products.map((product, index) => {
          return (
            <div className="col-3 mb-4" key={index}>
              <Card product={product} />
            </div>
          );
        })}
      </div>
    </Base>
  );
};

export default Home;
