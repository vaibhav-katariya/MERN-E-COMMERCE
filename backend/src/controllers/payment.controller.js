import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

const processPayment = async (req, res) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "E-commerce",
    },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
};

export { processPayment };
