const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");
const { log } = require("console");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  //   let form = new formidable.IncomingForm();
  //   form.keepExtensions = true;
  const form = formidable({ keepExtension: true });

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "Problem with the image",
      });
    }

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Cannot able to save the product",
        });
      }
      return res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  req.product.createdAt = undefined;
  req.product.updatedAt = undefined;
  return res.json(req.product);
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: "Cannot be able to remove the product",
      });
    }
    return res.json({
      message: "Product deleted successfully",
    });
  });
};

exports.updateProduct = (req, res) => {
  const form = formidable({ keepExtension: true });

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "Problem with the image",
      });
    }

    // 'lodash extend' method compare and mix the data.. below 'product' is database data and 'fields' are coming from the front end, it will compare and then join them
    let product = req.product;
    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Cannot able to update the product",
        });
      }
      return res.json(product);
    });
  });
};

// loading image
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      return res.json(products);
    });
};

// changing stock and sold
exports.updateStock = (req, res, next) => {
  // console.log("updateStock");
  // console.log(JSON.stringify(req.body));
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: {
          $inc: {
            stock: -1,
            sold: 1,
          },
        },
      },
    };
  });
  // console.log(JSON.stringify(myOperations));
  Product.bulkWrite(myOperations, {}, (error, products) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (error, category) => {
    if (error) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    return res.json(category);
  });
};
