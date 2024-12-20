import { app } from "./config"

app.listen(5898, () =>
  console.log(`
    http://localhost:5898,
    /api-docs : Documentacion en swagger con OpenApi 3.0
    `),
)
