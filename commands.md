## criado a imagem sem volume para garantir que seja stateless
docker build . -t service_orders .
docker run -p 3333:3333 service-orders

## gera o sql com base no schema e migra o banco de dados
npx drizzle-kit generate
npx drizzle-kit migrate