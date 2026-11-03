import { PayOS } from "@payos/node";
import { env } from "../config/env";

export type GatewayStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "OTHER";

export interface CreateCheckoutInput {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentGateway {
  createCheckout(input: CreateCheckoutInput): Promise<{ checkoutUrl: string }>;
  /** Asks the gateway what really happened to an order. */
  getStatus(orderCode: number): Promise<{ status: GatewayStatus; amountPaid: number }>;
  /** Verifies the webhook signature; throws when it does not match. */
  verifyWebhook(body: unknown): Promise<{ orderCode: number; amount: number; success: boolean }>;
}

const toStatus = (status: string): GatewayStatus =>
  status === "PAID" || status === "PENDING" || status === "CANCELLED" || status === "EXPIRED" ? status : "OTHER";

export class PayOSGateway implements PaymentGateway {
  private client = new PayOS({
    clientId: env.PAYOS_CLIENT_ID || "unset",
    apiKey: env.PAYOS_API_KEY || "unset",
    checksumKey: env.PAYOS_CHECKSUM_KEY || "unset",
  });

  async createCheckout(input: CreateCheckoutInput) {
    const link = await this.client.paymentRequests.create(input);
    return { checkoutUrl: link.checkoutUrl };
  }

  async getStatus(orderCode: number) {
    const link = await this.client.paymentRequests.get(orderCode);
    return { status: toStatus(link.status), amountPaid: link.amountPaid };
  }

  async verifyWebhook(body: unknown) {
    const webhook = body as Parameters<PayOS["webhooks"]["verify"]>[0];
    const data = await this.client.webhooks.verify(webhook);
    return { orderCode: data.orderCode, amount: data.amount, success: webhook.success && data.code === "00" };
  }
}

let gateway: PaymentGateway | undefined;

export const getGateway = (): PaymentGateway => (gateway ??= new PayOSGateway());

/** Tests inject a fake gateway; production never calls this. */
export const setGateway = (replacement: PaymentGateway | undefined) => {
  gateway = replacement;
};
