# Api para Mi Tiendita Online

![Node.js](https://img.shields.io/badge/Node.js-8CC84A?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQL Server](https://img.shields.io/badge/Microsoft_SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

---

Esta api esta disenada para las necesidades de Mi Tiendita Online.

> Viendo la reunion del 10/12/2024 se toco el tema del ORM y que los CRUD y funciones se arian mediante los procedure de la DB, cree los modelos y un esquema rapido de relaciones que no utilice, pero los deje ya que como cualquier proyecto que quiera escalar, se podria necesitar en el futuro.

## Rutas:

- /auth: Ruta para el manejo de seguridad, sesiones y usuarios
  - /auth/login
  - /auth/register
  - /auth/change_password
  - /auth/confirm_email/:user_hash
  - /auth/verify_session
- /productos: Ruta para administrar los productos de la empresa
  - /productos/crear
  - /productos/editar/:id
  - /productos/eliminar/:id
  - /productos/?page=""&?tags=""&?filtros=""

## Ejecutar Proyecto:

### Opcion 1:

Utilizando directamente el repositorio

```bash
    git clone <git:url>
    npm i
    npm run dev
```

_.env_

```
    MSQL_SERVER_URL="<url de la base de datos>"
```

### Opcion 2:

Utilizando Docker Compose

```bash
    docker compose up
```

> [!info] Esta version incluye la imagen de SQLServer
