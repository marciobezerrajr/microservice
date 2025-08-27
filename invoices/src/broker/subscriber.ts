import {orders} from "./channels/orders.ts"

orders.consume('orders', async message => {
    if (!message) {
      return null
    }
  
    console.log(message?.content.toString())
  
    orders.ack(message)
  }, {
    noAck: false, //sem confirmação de recebimento, será controlado de outra forma
  })