const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const getSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  });
};

const updateOrder = async (session, status) => {
  const supabase = getSupabase();
  const orderId = session.metadata && session.metadata.order_id;

  if (!supabase || !orderId) return;

  const patch = {
    status,
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent || null,
    customer_email: session.customer_details ? session.customer_details.email : null,
    customer_phone: session.customer_details ? session.customer_details.phone : null,
    shipping_details: session.shipping_details || null,
    updated_at: new Date().toISOString(),
  };

  if (status === "paid") {
    patch.paid_at = new Date().toISOString();
  }

  await supabase.from("orders").update(patch).eq("id", orderId);
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo nao permitido." });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe webhook nao configurado." });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook invalido: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    await updateOrder(event.data.object, "paid");
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    await updateOrder(event.data.object, "paid");
  }

  if (event.type === "checkout.session.async_payment_failed") {
    await updateOrder(event.data.object, "failed");
  }

  if (event.type === "checkout.session.expired") {
    await updateOrder(event.data.object, "expired");
  }

  return res.status(200).json({ received: true });
};
