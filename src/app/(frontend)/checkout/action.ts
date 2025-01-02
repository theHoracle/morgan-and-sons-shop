"use server"

import { payload } from "@/payload";
import { paystack } from "@/paystack";
import { v4 as uuidv4 } from 'uuid';

type CreatePaymentSessionResponse = { success: true; sessionUrl: string } | { success: false; error: string }
type CreatePaymentSessionParams = {
    unitAmount: number,
    cartId: string | number,
    fullName: string
}

export const createPaymentSession = async ({
    cartId, unitAmount, fullName
}: CreatePaymentSessionParams): Promise<CreatePaymentSessionResponse> => {
    if(unitAmount <= 1000) {
        return {
            success: false,
            error: 'Total must be greater than 1000'
        }
    }
    if(!cartId) {
        return {
            success: false,
            error: 'Cart ID is required'
        }
    }

    const userCart = await payload.findByID({
        collection: 'users-cart',
        id: cartId
    })
    if(!userCart || !userCart.user) return { success: false, error: 'Cart or User not found'};
    
    // gen random id for reference
    const reference = uuidv4()
    
    const order = await payload.create({
        collection: 'orders',
        data: {
            user: userCart.user,
            order: userCart.id,
            paymentStatus: 'pending',
            status: 'pending',
            referenceId: reference,
            deliveryDetails: [
                {
                    fullname: fullName,
                    address: 'No address provided',
                    paymentType: 'paystack',
                    shipmentType: 'delivery',
                },
            ],
        }
    })
    // get user details
    const user = typeof userCart.user === "number" 
            ? await payload.findByID({ collection: "users", id: userCart.user })
            : userCart.user

    try {
        const amountDonated = unitAmount * 100
        const paystackSession = await paystack.transaction.initialize({
            amount: amountDonated,
            currency: 'NGN',
            email: user.email,
            name: fullName,
            reference,
            callback_url: `${process.env.NEXT_PUBLIC_URL}/checkout/order?id=${order.id}`,
            metadata: {
                userId: user.id,
                orderId: order.id,
            }
        })
        console.log(paystackSession)
        return {
            success: true,
            sessionUrl: paystackSession.data?.authorization_url
        }
    } catch (error) {
        return {
            success: false,
            error: 'Something went wrong: ' + (error instanceof Error ? error.message : '') 
        }
    }
}

export const addDeliveryDetails = async (userId: string | number, details: { fullName: string, phoneNumber: string, address: string }) => {
    const user = await payload.findByID({ collection: 'users', id: userId })
    if(!user) return { success: false, error: 'User not found' }
    if(!user.deliveryDetails) {
        user.deliveryDetails = []
    }
    user.deliveryDetails.push(details)
    await payload.update({
        collection: 'users',
        id: userId,
        data: user
    })
    return { success: true }
}
