const FALLBACK_PRODUCTS = [
  {
    id: "narguile",
    title: "Narguile Completo",
    price_cents: 8990,
    active: true,
  },
  {
    id: "longneck",
    title: "Bebida Long Neck",
    price_cents: 1250,
    active: true,
  },
  {
    id: "dose",
    title: "Dose Promocional",
    price_cents: 1800,
    active: true,
  },
  {
    id: "copao",
    title: "Copao + Refri",
    price_cents: 2990,
    active: true,
  },
];

const getProductsByIds = async (supabase, ids) => {
  if (!supabase) {
    return FALLBACK_PRODUCTS.filter((product) => ids.includes(product.id));
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,title,price_cents,active")
    .in("id", ids)
    .eq("active", true);

  if (error) {
    throw new Error(`Erro ao buscar produtos: ${error.message}`);
  }

  return data;
};

module.exports = {
  FALLBACK_PRODUCTS,
  getProductsByIds,
};
