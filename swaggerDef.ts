import swaggerJSDoc from "swagger-jsdoc"
const swaggerDefinition = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Ecomerce Api",
      version: "1.0.0",
      description: "Api Reto360, existen muchos endpoints que no estan en esta documentacion, ya que es mas comodo testearlo desde Postman, Yaak, o Cuando se cree el Front",
    },
    servers: [
      {
        url: "http://localhost:5898",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}
export const swaggerDosc = swaggerJSDoc(swaggerDefinition)
