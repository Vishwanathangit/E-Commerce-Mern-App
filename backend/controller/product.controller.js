const db = require("../models");
const Product = db.product;
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.description || !req.body.price || !req.body.imageBase64) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageBase64: req.body.imageBase64 // Changed from imagePath to imageBase64
    });
    product
      .save(product)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the product."
        });
      });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the product."
    });
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while fetching the product."
    });
  }
};

exports.checkoutProducts = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

exports.verifyCheckout = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};