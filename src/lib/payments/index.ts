/**
 * Payment adapter (stub). Phase one has no payment processor: orders are sent
 * over WhatsApp and payment is arranged there. To add mobile money, card or
 * bank payment later, implement PaymentProvider and return it from getPayments().
 * No provider is integrated yet on purpose.
 */
export type CartSnapshot = {
  lines: Array<{ productId: string; qty: number }>;
  currency: string;
};

export type CheckoutSession = { reference: string; redirectUrl?: string };

export interface PaymentProvider {
  readonly name: string;
  createCheckout(cart: CartSnapshot): Promise<CheckoutSession>;
  verify(reference: string): Promise<{ paid: boolean }>;
}

/** Default: no online payment. */
export const nonePaymentProvider: PaymentProvider = {
  name: "none",
  async createCheckout() {
    throw new Error("Online payment is not enabled. Orders are placed over WhatsApp.");
  },
  async verify() {
    return { paid: false };
  },
};

export function getPayments(): PaymentProvider {
  return nonePaymentProvider;
}
