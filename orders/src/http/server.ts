import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'

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
}, (request, reply) => {
    const { amount } = request.body
    console.log('Creating order with amount', amount)
    return reply.status(201).send()
})


app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => {
    console.log('[Orders] HTTP Server is running')
})
