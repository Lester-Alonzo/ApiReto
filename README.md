# Api para Mi Tiendita Online

---

Esta api esta disenada para las necesidades de Mi Tiendita Online supliendo todos los apartados que podria necesitar tando a nivel administrativo como a nivel tecnico.

## Rutas:

- /auth: Ruta para el manejo de seguridad, sesiones y usuarios
  - /auth/login
  - /auth/register
  - /auth/change_password
  - /auth/confirm_email/:user_hash
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
