const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((error, order) => {
      if (error) {
        return res.status(400).json({
          error: "No order found",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  // console.log("REQ", req);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  // console.log("ORDER", order);
  order.save((error, order) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "Failed to save your order",
      });
    }
    return res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "name _id")
    .exec((error, orders) => {
      if (error) {
        return res.status(400).json({
          error: "No orders found",
        });
      }
      return res.json(orders);
    });
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (error, order) => {
      if (error) {
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      return res.json(order);
    }
  );
};

exports.getOrderStatus = (req, res) => {
  return res.json(Order.schema.path("status").enumValues);
};
