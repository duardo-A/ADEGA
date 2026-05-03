const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");
const { getProductsByIds } = require("./_catalog");

const DELIVERY_FEE_CENTS = 800;

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const getSiteUrl = (req) => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers.host}`;
};

const getSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  });
};

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      id: String(item.id || ""),
      quantity: Math.max(1, Math.min(Number.parseInt(item.quantity, 10) || 1, 20)),
    }))
    .filter((item) => item.id);
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo nao permitido." });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "STRIPE_SECRET_KEY nao configurada." });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = getSupabase();
    const body = await readJsonBody(req);
    const requestedItems = normalizeItems(body.items);

    if (!requestedItems.length) {
      return res.status(400).json({ error: "Carrinho vazio." });
    }

    const requestedIds = [...new Set(requestedItems.map((item) => item.id))];
    const products = await getProductsByIds(supabase, requestedIds);
    const productsById = new Map(products.map((product) => [product.id, product]));

    const orderItems = requestedItems.map((item) => {
      const product = productsById.get(item.id);
      if (!product) {
        throw new Error(`Produto invalido: ${item.id}`);
      }

      return {
        id: product.id,
        title: product.title,
        quantity: item.quantity,
        price_cents: product.price_cents,
      };
    });

    const subtotalCents = orderItems.reduce(
      (sum, item) => sum + item.price_cents * item.quantity,
      0
    );
    const totalCents = subtotalCents + DELIVERY_FEE_CENTS;

    let order = null;
    if (supabase) {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          status: "pending",
          items: orderItems,
          amount_subtotal_cents: subtotalCents,
          delivery_fee_cents: DELIVERY_FEE_CENTS,
          amount_total_cents: totalCents,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(`Erro ao criar pedido: ${error.message}`);
      }

      order = data;
    }

    const siteUrl = getSiteUrl(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        ...orderItems.map((item) => ({
          price_data: {
            currency: "brl",
            product_data: {
              name: item.title,
            },
            unit_amount: item.price_cents,
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Entrega",
            },
            unit_amount: DELIVERY_FEE_CENTS,
          },
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel.html`,
      client_reference_id: order ? order.id : undefined,
      metadata: {
        order_id: order ? order.id : "",
        source: "casa-brasa-site",
      },
    });

    if (supabase && order) {
      await supabase
        .from("orders")
        .update({
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    }

    return res.status(200).json({
      url: session.url,
      order_id: order ? order.id : null,
      amount_total_cents: totalCents,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Erro ao criar pagamento." });
  }
};
