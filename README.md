# Api para Mi Tiendita Online

![Node.js](https://img.shields.io/badge/Node.js-8CC84A?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQL Server](https://img.shields.io/badge/Microsoft_SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

---

Esta api esta disenada para las necesidades de Mi Tiendita Online.

> Viendo la reunion del 10/12/2024 se toco el tema del ORM y que los CRUD y funciones se arian mediante los procedure de la DB, cree los modelos y un esquema rapido de relaciones que no utilice, pero los deje ya que como cualquier proyecto que quiera escalar, se podria necesitar en el futuro.

## Rutas:

- /auth: Ruta para el manejo de seguridad, sesiones y Admins
- /productos(middleware para validar sesion y rol): Ruta para administrar los productos de la empresa
- /estado(middleware para validar sesion y rol): Rutapara administrar los estados
- /rol(middleware para validar sesion y rol): Ruta para administrar los roles
- /categoria(middleware para validar sesion y rol): Ruta para administrar las categorias
- /ordend(middleware para validar sesion y rol): Ruta para crear ordenes, y autorizar las mismas
- /clientes(middleware para validar sesion y rol): Ruta para el login de clientes, y para la creacion y listarlos

> _.env_: no se incluyo en este sprint ya que para motivos de calificacion es mas comodo trabajar con CONSTANTS, en el producto final de produccion se implementaran los .env tanto en el back como en el front


## Ejecutar Proyecto:

### Opcion 1:

Utilizando directamente el repositorio

```bash
  #Modo dev
    git clone <git:url>
    npm i
    npm run dev
  #Modo Produccion
  npm run build
  npm run start
```

### Opcion 2:

Utilizando Docker Compose

```bash
    docker compose up
```

> [!info] Esta version incluye la imagen de SQLServer
