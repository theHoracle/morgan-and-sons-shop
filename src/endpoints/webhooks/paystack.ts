import type { Endpoint } from 'payload'
import { PaystackWebhookEvent } from './paystack-types';
// import {createHmac} from 'crypto'

const PAYSTACK_IPS: string[] = [
    '52.31.139.75',
    '52.49.173.169',
    '52.214.14.220'
] as const;

const PaystackWebhook: Endpoint = {
    path: '/webhooks/paystack',
    method: 'post',
    handler: async ( req ) => {
      try {
        // @ts-expect-error tye
        const body = await req.text()
        // const SECRET = process.env.PAYSTACK_SECRET_KEY!
        // const hash = createHmac('sha512', SECRET).update(JSON.stringify(body)).digest('hex');
        // const signature = req.headers.get('x-paystack-signature');
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
            
        // if (!signature || hash !== signature) {
        console.log('ip: ', ip, 'status: ', PAYSTACK_IPS.includes(ip!))
        if(!ip || !(PAYSTACK_IPS.includes(ip))) {
            return Response.json(
                { error: 'Forbidden IP address, hehehe' },
                { status: 401 }
            );
        }
        let event: PaystackWebhookEvent;
            try {
                event = JSON.parse(body);
            } catch (e) {
                console.log('JSON parse error:', e);
                return new Response(
                    JSON.stringify({ error: 'Invalid JSON payload' }),
                    { 
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        const session = event?.data
        if(!session.metadata.userId || !session.metadata.orderId) {
            return Response.json({
                error: 'Webhook Error: No information present in Metadata'
            }, {status: 400})
        }
        if(event.event == 'charge.success') {
            const { payload } = req
            const user = await payload.findByID({
                collection: 'users',
                id: session.metadata.userId    
            })

            if (!user) {
                return Response.json({
                    error: 'Webhook Error: No user defined'
                }, {status: 400})
              }
    
            const order = await payload.findByID({
                collection: 'orders',
                id: session.metadata.orderId
            })

            if(!order) {
                return Response.json({
                    error: 'Webhook Error: No order found'
                }, {status: 400})
            }

            // Update order info to verify payment on server
            await Promise.all([
                payload.update({
                    collection: 'orders',
                    id: order.id,
                    data: {
                        paymentStatus: 'paid',
                        status: 'shipped',
                    }
                }),
                payload.update({
                    collection: "users-cart",
                    id: typeof order.order === "number" ? order.order : order.order.id,
                    data: {
                        cartStatus: "checkedOut"
                    }
                })
            ]) 
            return Response.json({message: 'Updated Successfully'}, {status: 200})
        }
        return Response.json({message: 'No relevant event found'}, {status: 400})
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: 'Internal Server Error: ' + error  },
            { status: 500 }
        );
    }
    
    }

}

export default PaystackWebhook