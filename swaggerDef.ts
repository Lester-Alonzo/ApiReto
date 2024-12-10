import swaggerJSDoc from 'swagger-jsdoc'
const swaggerDefinition = {
    swaggerDefinition:{
        myapi:"3.0.0",
        info: {
            title: "Ecomerce Api",
            version: "1.0.0",
            description: "Api para un ecomerce"
        },
        servers: [
            {
                url: "http://localhost:5898"
            }
        ]
    },
    apis: ['./src/routes/*.ts']
}
export const swaggerDosc = swaggerJSDoc(swaggerDefinition)