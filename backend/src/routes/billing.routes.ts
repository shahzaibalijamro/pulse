import { Router } from "express";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { WorkspaceModel } from "../models/workspace.model.js";
import { HttpError } from "../utils/httpError.js";
import { UserModel } from "../models/user.model.js";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_123", {
  apiVersion: "2024-04-10" as any // Type override for older packages, safely works.
});

export const billingRouter = Router();
export const webhookRouter = Router();

// Dashboard-facing routes require auth
billingRouter.use(requireAuth);

billingRouter.post(
  "/checkout",
  asyncHandler(async (req, res) => {
    const workspaceId = req.auth!.workspaceId;
    const workspace = await WorkspaceModel.findById(workspaceId);
    const user = await UserModel.findById(req.auth!.userId).select("email").lean();
    if (!user) throw new HttpError(404, "User not found");

    if (!workspace) throw new HttpError(404, "Workspace not found");
    if (workspace.plan === "pro") throw new HttpError(400, "Already on PRO plan");

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new HttpError(500, "Stripe Price ID is not configured");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${env.CLIENT_ORIGIN}/dashboard/settings/billing?success=true`,
      cancel_url: `${env.CLIENT_ORIGIN}/dashboard/settings/billing?canceled=true`,
      client_reference_id: workspaceId.toString(),
      customer_email: user.email // Assuming email is on req.auth, otherwise leave blank or fetch User.
    });

    res.json({ url: session.url });
  })
);

billingRouter.post(
  "/portal",
  asyncHandler(async (req, res) => {
    const workspaceId = req.auth!.workspaceId;
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) throw new HttpError(404, "Workspace not found");
    if (!workspace.stripeCustomerId) throw new HttpError(400, "No active subscription found");

    const session = await stripe.billingPortal.sessions.create({
      customer: workspace.stripeCustomerId,
      return_url: `${env.CLIENT_ORIGIN}/dashboard/settings/billing`
    });

    res.json({ url: session.url });
  })
);

// Webhook route does not require auth, validates via signature
webhookRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      throw new HttpError(400, "Missing signature or webhook secret");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      throw new HttpError(400, `Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const workspaceId = session.client_reference_id;

      if (workspaceId) {
        await WorkspaceModel.findByIdAndUpdate(workspaceId, {
          plan: "pro",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string
        });
      }
    } else if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;

      // If deleted or canceled, revert to free
      if (status === "canceled" || status === "unpaid") {
        await WorkspaceModel.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { plan: "free", stripeSubscriptionId: null } // We might want to keep the customer ID to avoid creating new ones, so we just null the sub.
        );
      }
    }

    res.json({ received: true });
  })
);
