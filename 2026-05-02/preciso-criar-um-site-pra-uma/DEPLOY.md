# Deploy na Vercel com Supabase e Stripe

## 1. Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode o arquivo `supabase/schema.sql`.
4. Copie:
   - Project URL
   - service_role key

Nunca coloque a `service_role key` no frontend. Ela fica somente nas variaveis da Vercel.

## 2. Stripe

1. Crie uma conta no Stripe.
2. Pegue a chave secreta de teste `sk_test_...`.
3. Depois do deploy, crie um webhook apontando para:

```txt
https://SEU-DOMINIO.vercel.app/api/stripe-webhook
```

Eventos recomendados:

```txt
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

4. Copie o webhook secret `whsec_...`.

## 3. Variaveis de ambiente na Vercel

Configure em Project Settings > Environment Variables:

```txt
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SITE_URL
```

Em producao, `SITE_URL` deve ser a URL final do site, por exemplo:

```txt
https://casa-brasa.vercel.app
```

## 4. Deploy

Pelo terminal, dentro da pasta do projeto:

```bash
npm install
npm run deploy
```

Ou suba o projeto para o GitHub e importe o repositorio no painel da Vercel.

## 5. Teste

Use as chaves de teste do Stripe primeiro. So troque para as chaves live depois de validar:

- checkout abre corretamente
- pedido aparece em `orders`
- webhook muda `status` para `paid`
- pagina de sucesso abre depois do pagamento
