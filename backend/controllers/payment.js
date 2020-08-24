var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Production,
  merchantId: "YOUR_PRODUCTION_MERCHANT_ID",
  publicKey: "YOUR_PRODUCTION_PUBLIC_KEY",
  privateKey: "YOUR_PRODUCTION_PRIVATE_KEY",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
};
