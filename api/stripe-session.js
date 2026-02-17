#!/usr/bin/env node

/**
 * Stripe Checkout Session Creator for AgentLeaderboards
 * Usage: node stripe-session.js
 * Returns: Checkout session URL (JSON)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession() {
  try {
    // Create or retrieve the Premium product and price
    const products = await stripe.products.search({
      query: `name:'AgentLeaderboards Premium' AND metadata['bot']:'agentleaderboards'`,
    });

    let priceId;

    if (products.data.length > 0) {
      // Product exists, get its price
      const prices = await stripe.prices.list({
        product: products.data[0].id,
        active: true,
      });
      priceId = prices.data[0].id;
    } else {
      // Create new product and price
      const product = await stripe.products.create({
        name: 'AgentLeaderboards Premium',
        description: 'Unlimited AI agent comparisons, advanced analytics, API access, and more',
        metadata: {
          bot: 'agentleaderboards',
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 999, // $9.99
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          bot: 'agentleaderboards',
        },
      });

      priceId = price.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://92.112.184.224/apps/agentleaderboards/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://92.112.184.224/apps/agentleaderboards/pricing.html',
      metadata: {
        bot: 'agentleaderboards',
      },
    });

    console.log(JSON.stringify({ url: session.url, sessionId: session.id }));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

createCheckoutSession();
