export type StripePreBuyType = {
    paymentIntentId: string
    ephemeralKey: string
    ephemeralKeySecret: string
    customerId: string
    paymentIntentSecret: string
    totalAmount: number
}