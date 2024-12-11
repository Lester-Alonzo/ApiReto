import { Sequelize, Model, DataTypes } from "@sequelize/core"
import { MsSqlDialect } from "@sequelize/mssql"
import { usuarios } from "./models/usuarios"

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: "localhost",
  port: 1433,
  database: "EcomerceV3",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "L@grasaesgrasa2025",
    },
  },
  encrypt: true,
  trustServerCertificate: true,
})
async function SQLServerPing() {
  try {
    const respons = await sequelize.authenticate()
    console.log(respons)
  } catch (error) {
    console.error(error)
  }
}
;(async () => await SQLServerPing())()
