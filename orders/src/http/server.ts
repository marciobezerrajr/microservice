import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { channels } from '../broker/channels/index.ts'
import { randomUUID } from 'node:crypto'
import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'
import { dispatchOrderCreated } from '../broker/messages/order-created.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: '*'
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
    return 'ok'
})


app.post('/orders', {
    schema: {
        body: z.object({
            amount: z.number()
        }),
    },
}, async (request, reply) => {

    const { amount } = request.body
    const orderId= randomUUID()

    dispatchOrderCreated({
        orderId,
        amount,
        customer: {
            id: '8be77e5f-aa4f-458d-8c73-46729c00f105',
        }
    })

    await db.insert(schema.orders).values({
        id: randomUUID(),
        customerId: '8be77e5f-aa4f-458d-8c73-46729c00f105',
        amount,
    })

    return reply.status(201).send()
})


app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => {
    console.log('[Orders] HTTP Server is running')
})
