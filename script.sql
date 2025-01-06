IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EcomerceV3')
BEGIN
	CREATE DATABASE EcomerceV3;
END;
USE EcomerceV3;
--USE Master;
--DROP DATABASE EcomerceV3;
-- Creación de tablas
CREATE TABLE rol (
    idrol INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE estados (
    idestados INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE Clientes (
    idClientes INT PRIMARY KEY IDENTITY,
    razon_social VARCHAR(245) NULL,
    nombre_comercial VARCHAR(34) NOT NULL UNIQUE,
    direccion_entrega VARCHAR(45) NULL,
    telefono VARCHAR(45) NOT NULL UNIQUE,
    email VARCHAR(45) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    estado_idEstado int NOT NULL
    FOREIGN KEY (estado_idEstado) REFERENCES estados(idestados)
);

CREATE TABLE usuarios (
    idusuarios INT PRIMARY KEY IDENTITY,
    rol_idrol INT NOT NULL,
    estados_idestados INT NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    nombre_completo VARCHAR(500) NOT NULL,
    password VARCHAR(100) NOT NULL, -- se hashea en el backend
    telefono VARCHAR(45) NULL,
    fecha_nacimiento DATE NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    Clientes_idClientes INT NULL,
    FOREIGN KEY (rol_idrol) REFERENCES rol(idrol),
    FOREIGN KEY (estados_idestados) REFERENCES estados(idestados),
    FOREIGN KEY (Clientes_idClientes) REFERENCES Clientes(idClientes)
);

CREATE TABLE CategoriaProductos (
    idCategoriaProductos INT PRIMARY KEY IDENTITY,
    usuarios_idusuarios INT NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    estados_idestados INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (usuarios_idusuarios) REFERENCES usuarios(idusuarios),
    FOREIGN KEY (estados_idestados) REFERENCES estados(idestados)
);

CREATE TABLE Productos (
    idProductos INT PRIMARY KEY IDENTITY,
    CategoriaProductos_IDCategoria INT NOT NULL,
    usuarios_idusuarios INT NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    marca VARCHAR(45) NOT NULL,
    codigo VARCHAR(45) UNIQUE NOT NULL,
    stock FLOAT DEFAULT 0 NOT NULL,
    estados_idestados INT NOT NULL,
    precio FLOAT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    foto VARCHAR(MAX) NULL,
    FOREIGN KEY (CategoriaProductos_IDCategoria) REFERENCES CategoriaProductos(idCategoriaProductos),
    FOREIGN KEY (usuarios_idusuarios) REFERENCES usuarios(idusuarios),
    FOREIGN KEY (estados_idestados) REFERENCES estados(idestados)
);

CREATE TABLE Orden (
    idOrden INT PRIMARY KEY IDENTITY,
    usuarios_idusuarios INT NULL,
    estados_idestados INT NOT NULL,
    client_idClient INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    nombre_completo VARCHAR(80) NOT NULL,
    direccion VARCHAR(545) NOT NULL,
    telefono VARCHAR(45) NOT NULL,
    correo_electronico VARCHAR(70) NOT NULL,
    fecha_entrega DATE NULL,
    total_orden FLOAT NOT NULL,
    completado BIT DEFAULT 0,
    FOREIGN KEY (usuarios_idusuarios) REFERENCES usuarios(idusuarios),
    FOREIGN KEY (estados_idestados) REFERENCES estados(idestados),
    FOREIGN KEY (client_idClient) REFERENCES Clientes(idClientes)
);

CREATE TABLE OrdenDetalles (
    idOrdenDetalles INT PRIMARY KEY IDENTITY,
    Orden_idOrden INT NOT NULL,
    Productos_idProductos INT NOT NULL,
    cantidad INT NOT NULL,
    precio FLOAT NOT NULL,
    subtotal FLOAT NOT NULL,
    FOREIGN KEY (Orden_idOrden) REFERENCES Orden(idOrden),
    FOREIGN KEY (Productos_idProductos) REFERENCES Productos(idProductos)
);

CREATE TABLE Auditoria (
    idAuditoria INT PRIMARY KEY IDENTITY,
    tabla VARCHAR(50),
    accion VARCHAR(20),
    fecha DATETIME DEFAULT GETDATE(),
    idRegistro INT,
    descripcion TEXT
);

-- Trigger para registrar modificaciones o eliminaciones de productos
CREATE TRIGGER trg_ProductosAuditoria
ON Productos
AFTER UPDATE, DELETE
AS
BEGIN
    IF EXISTS (SELECT * FROM INSERTED)
    BEGIN
        -- Registro de actualización
        INSERT INTO Auditoria (tabla, accion, idRegistro, descripcion)
        SELECT 'Productos', 'UPDATE', i.idProductos,
               CONCAT('Stock cambiado a ', i.stock, ', estado cambiado a ', i.estados_idestados)
        FROM INSERTED i;
    END

    IF EXISTS (SELECT * FROM DELETED)
    BEGIN
        -- Registro de eliminación
        INSERT INTO Auditoria (tabla, accion, idRegistro, descripcion)
        SELECT 'Productos', 'DELETE', d.idProductos,
               CONCAT('Producto eliminado: ', d.nombre)
        FROM DELETED d;
    END
END;

-- Trigger para actualizar el stock de productos al autorizar una orden (modificado)
CREATE TRIGGER trg_ActualizarStockAlAutorizarOrden
ON Orden
AFTER UPDATE
AS
BEGIN
    -- Verificar si la columna usuarios_idusuarios ha cambiado a un valor diferente de NULL
    IF UPDATE(usuarios_idusuarios) AND EXISTS (SELECT 1 FROM inserted WHERE usuarios_idusuarios IS NOT NULL)
    BEGIN
        -- Recorrer los detalles de la orden que se está autorizando
        DECLARE @idOrden INT;
        SELECT @idOrden = idOrden FROM inserted;

        DECLARE @Productos_idProductos INT;
        DECLARE @cantidad INT;
        DECLARE cursor_orden CURSOR FOR
        SELECT Productos_idProductos, cantidad
        FROM OrdenDetalles
        WHERE Orden_idOrden = @idOrden;

        OPEN cursor_orden;
        FETCH NEXT FROM cursor_orden INTO @Productos_idProductos, @cantidad;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Actualizar el stock del producto
            UPDATE Productos
            SET stock = stock - @cantidad
            WHERE idProductos = @Productos_idProductos;

            FETCH NEXT FROM cursor_orden INTO @Productos_idProductos, @cantidad;
        END

        CLOSE cursor_orden;
        DEALLOCATE cursor_orden;
    END
END;



-- Procedimientos almacenados
CREATE PROCEDURE CrearRoles
    @nombre VARCHAR(45)
AS
BEGIN
    INSERT INTO rol (nombre) VALUES (@nombre);
END;

CREATE PROCEDURE CrearEstados
    @nombre VARCHAR(45)
AS
BEGIN
    INSERT INTO estados (nombre) VALUES (@nombre);
END;

CREATE PROCEDURE CrearClientes
    @razon_social VARCHAR(245),
    @nombre_comercial VARCHAR(34),
    @direccion_entrega VARCHAR(45),
    @telefono VARCHAR(45),
    @email VARCHAR(45),
    @estado INT,
    @pass VARCHAR(100)
AS
BEGIN
    INSERT INTO Clientes (razon_social, estado_idEstado,nombre_comercial, direccion_entrega, telefono, email, password)
    VALUES (@razon_social, @estado ,@nombre_comercial, @direccion_entrega, @telefono, @email, @pass);
END;

CREATE PROCEDURE CrearUsuarios
    @rol_idrol INT,
    @estados_idestados INT,
    @correo_electronico VARCHAR(100),
    @nombre_completo VARCHAR(500),
    @password VARCHAR(100),
    @telefono VARCHAR(45)
AS
BEGIN
    INSERT INTO usuarios (rol_idrol, estados_idestados, correo_electronico, nombre_completo, password, telefono)
    VALUES (@rol_idrol, @estados_idestados, @correo_electronico, @nombre_completo, @password, @telefono);
END;

CREATE PROCEDURE CrearCategorias
    @usuarios_idusuarios INT,
    @nombre VARCHAR(45),
    @estados_idestados INT
AS
BEGIN
    INSERT INTO CategoriaProductos (usuarios_idusuarios, nombre, estados_idestados)
    VALUES (@usuarios_idusuarios, @nombre, @estados_idestados);
END;

CREATE PROCEDURE CrearProductos
    @CategoriaProductos_IDCategoria INT,
    @usuarios_idusuarios INT,
    @nombre VARCHAR(45),
    @marca VARCHAR(45),
    @codigo VARCHAR(45),
    @stock FLOAT,
    @estados_idestados INT,
    @precio FLOAT,
    @foto VARCHAR(MAX)
AS
BEGIN
    INSERT INTO Productos (CategoriaProductos_IDCategoria, usuarios_idusuarios, nombre, marca, codigo, stock, estados_idestados, precio, foto)
    VALUES (@CategoriaProductos_IDCategoria, @usuarios_idusuarios, @nombre, @marca, @codigo, @stock, @estados_idestados, @precio, @foto);
END;

CREATE PROCEDURE CrearOrdenes
    @usuarios_idusuarios INT,
    @estados_idestados INT,
    @nombre_completo VARCHAR(80),
    @direccion VARCHAR(545),
    @telefono VARCHAR(45),
    @correo_electronico VARCHAR(70),
    @total_orden FLOAT,
    @cliente INT
AS
BEGIN
    INSERT INTO Orden (usuarios_idusuarios, estados_idestados, nombre_completo, direccion, telefono, correo_electronico, total_orden, client_idClient)
   	VALUES (@usuarios_idusuarios, @estados_idestados, @nombre_completo, @direccion, @telefono, @correo_electronico, @total_orden, @cliente);

   SELECT SCOPE_IDENTITY() AS IdPedido;
END;

CREATE PROCEDURE CrearOrdenDetalles
    @Orden_idOrden INT,
    @Productos_idProductos INT,
    @cantidad INT,
    @precio FLOAT,
    @subtotal FLOAT
AS
BEGIN
    INSERT INTO OrdenDetalles (Orden_idOrden, Productos_idProductos, cantidad, precio, subtotal)
    VALUES (@Orden_idOrden, @Productos_idProductos, @cantidad, @precio, @subtotal);
END;

-- Procedimiento almacenado para inactivar productos
CREATE PROCEDURE InactivarProducto
    @idProducto INT,
    @idEstado INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM estados WHERE idestados = @idEstado)
    BEGIN
        RAISERROR ('El estado especificado no existe.', 16, 1);
        RETURN;
    END

    UPDATE Productos
    SET estados_idestados = @idEstado
    WHERE idProductos = @idProducto;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('El producto especificado no existe.', 16, 1);
       RETURN;
    END
    ELSE
    BEGIN
        PRINT 'El producto ha sido inactivado correctamente.';
    END
END;


CREATE PROCEDURE InactivarUsuario
    @idUsuario INT,
    @idEstado INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM estados WHERE idestados = @idEstado)
    BEGIN
        RAISERROR ('El estado especificado no existe.', 16, 1);
        RETURN;
    END

    UPDATE usuarios
    SET estados_idestados = @idEstado
    WHERE idusuarios = @idUsuario;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('El usuario especificado no existe.', 16, 1);
       RETURN;
    END
    ELSE
    BEGIN
        PRINT 'El usuario ha sido inactivado correctamente.';
    END
END;

CREATE PROCEDURE InactivarOrden
    @idOrden INT,
    @idEstado INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM estados WHERE idestados = @idEstado)
    BEGIN
        RAISERROR ('El estado especificado no existe.', 16, 1);
        RETURN;
    END

    UPDATE Orden
    SET estados_idestados = @idEstado
    WHERE idOrden = @idOrden;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('La orden especificado no existe.', 16, 1);
       RETURN;
    END
    ELSE
    BEGIN
        PRINT 'La orden ha sido inactivado correctamente.';
    END
END;

CREATE PROCEDURE InactivarCatProducto
    @idCat INT,
    @idEstado INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM estados WHERE idestados = @idEstado)
    BEGIN
        RAISERROR ('El estado especificado no existe.', 16, 1);
        RETURN;
    END

    UPDATE CategoriaProductos
    SET estados_idestados = @idEstado
    WHERE idCategoriaProductos = @idCat;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('La categoria especificada no existe.', 16, 1);
       RETURN;
    END
    ELSE
    BEGIN
        PRINT 'La categoria ha sido inactivada correctamente.';
    END
END;

CREATE PROCEDURE InactivarCliente
    @idCliente INT,
    @idEstado INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM estados WHERE idestados = @idEstado)
    BEGIN
        RAISERROR ('El estado especificado no existe.', 16, 1);
        RETURN;
    END

    UPDATE Clientes
    SET estado_idEstado = @idEstado
    WHERE idClientes = @idCliente;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('El cliente especificado no existe.', 16, 1);
       RETURN;
    END
    ELSE
    BEGIN
        PRINT 'El cliente ha sido inactivado correctamente.';
    END
END;

-- procesos almacenados para actualizacion de datos
CREATE PROCEDURE ActualizarRol
    @idrol INT,
    @nombre VARCHAR(45)
AS
BEGIN
    UPDATE rol
    SET nombre = @nombre
    WHERE idrol = @idrol;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('El rol especificado no existe.', 16, 1);
        RETURN;
    END
    ELSE
    BEGIN
        PRINT 'El rol ha sido actualizado correctamente.';
    END
END;



CREATE PROCEDURE EntregarOrden
	@idOrden INT
AS
BEGIN
UPDATE Orden
SET completado = 1
WHERE idOrden = @idOrden
END;

CREATE PROCEDURE ActualizarEstado
    @idestados INT,
    @nombre VARCHAR(45)
AS
BEGIN
    UPDATE estados
    SET nombre = @nombre
    WHERE idestados = @idestados;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('El estado especificado no existe.', 16, 1);
    END
    ELSE
    BEGIN
        PRINT 'El estado ha sido actualizado correctamente.';
    END
END;


CREATE TRIGGER trg_AfterUpdate_CategoriaProductos
ON CategoriaProductos
AFTER UPDATE 
AS 
BEGIN
	UPDATE Productos
	SET estados_idestados = 2
	WHERE CategoriaProductos_IDCategoria IN (SELECT idCategoriaProductos FROM inserted)
	AND estados_idestados = 1
	AND EXISTS (
		SELECT 1 FROM inserted WHERE estados_idestados = 2
	)
	
	UPDATE Productos
	SET estados_idestados = 1
	WHERE CategoriaProductos_IDCategoria IN (SELECT idCategoriaProductos FROM inserted)
		AND estados_idestados = 2
		AND EXISTS  (
			SELECT 1 FROM inserted WHERE estados_idestados = 1
		)
END;

CREATE TRIGGER trg_AfterDElete_OrdenDetalles
ON OrdenDetalles
AFTER DELETE 
AS
BEGIN
	DECLARE @OrdenID INT;
	DECLARE @NuevoTotal DECIMAL(18, 2);
	
	SELECT @OrdenID = Orden_idOrden FROM deleted;
	
	SELECT @NuevoTotal = SUM(precio * cantidad)
	FROM OrdenDetalles
	WHERE Orden_idOrden = @OrdenID;
	
	UPDATE Orden
	SET total_orden = @NuevoTotal
	WHERE idOrden = @OrdenID;
END;




CREATE PROCEDURE ActualizarCategoria
    @idCategoriaProductos INT,
    @nombre VARCHAR(45),
    @estados_idestados INT
AS
BEGIN
    UPDATE CategoriaProductos
    SET nombre = @nombre,
        estados_idestados = @estados_idestados
    WHERE idCategoriaProductos = @idCategoriaProductos;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('La categoría especificada no existe.', 16, 1);
       RETURN;
    END
    ELSE
    BEGIN
        PRINT 'La categoría ha sido actualizada correctamente.';
    END
END;

-- Los siguiesntes procedure estan echos asi para mayor comodidad ya que las tablas contienen muchos campos
CREATE PROCEDURE ActualizarCampoOrdenDetalles
    @id INT,
    @Campo NVARCHAR(50),
    @NuevoValor NVARCHAR(MAX)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @ColumnExists INT;
    SELECT @ColumnExists = COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'OrdenDetalles' AND COLUMN_NAME = @Campo;
    IF @ColumnExists = 0
    BEGIN
        RAISERROR('Campo no permitido', 16, 1);
        RETURN;
    END

    SET @sql = 'UPDATE OrdenDetalles SET ' + QUOTENAME(@Campo) + ' = @NuevoValor WHERE idOrdenDetalles = @id';

    EXEC sp_executesql @sql, N'@NuevoValor NVARCHAR(MAX), @id INT', @NuevoValor, @id;
END;

CREATE PROCEDURE ActualizarCampoClientes
    @id INT,
    @Campo NVARCHAR(50),
    @NuevoValor NVARCHAR(MAX)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @ColumnExists INT;

    SELECT @ColumnExists = COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Clientes' AND COLUMN_NAME = @Campo;
    IF @ColumnExists = 0
    BEGIN
        RAISERROR('Campo no permitido', 16, 1);
        RETURN;
    END

    SET @sql = 'UPDATE Clientes SET ' + QUOTENAME(@Campo) + ' = @NuevoValor WHERE idClientes = @id';

    EXEC sp_executesql @sql, N'@NuevoValor NVARCHAR(MAX), @id INT', @NuevoValor, @id;
END;

CREATE PROCEDURE ActualizarCampoUsuario
    @id INT,
    @Campo NVARCHAR(50),
    @NuevoValor NVARCHAR(MAX)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @ColumnExists INT;

    SELECT @ColumnExists = COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = @Campo;
    IF @ColumnExists = 0
    BEGIN
        RAISERROR('Campo no permitido', 16, 1);
        RETURN;
    END

    SET @sql = 'UPDATE usuarios SET ' + QUOTENAME(@Campo) + ' = @NuevoValor WHERE idusuarios = @id';

    EXEC sp_executesql @sql, N'@NuevoValor NVARCHAR(MAX), @id INT', @NuevoValor, @id;
END;

CREATE PROCEDURE ActualizarCampoProducto
    @id INT,
    @Campo NVARCHAR(50),
    @NuevoValor NVARCHAR(MAX)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @ColumnExists INT;

    SELECT @ColumnExists = COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Productos' AND COLUMN_NAME = @Campo;
    IF @ColumnExists = 0
    BEGIN
        RAISERROR('Campo no permitido', 16, 1);
        RETURN;
    END

    SET @sql = 'UPDATE Productos SET ' + QUOTENAME(@Campo) + ' = @NuevoValor WHERE idProductos = @id';

    EXEC sp_executesql @sql, N'@NuevoValor NVARCHAR(MAX), @id INT', @NuevoValor, @id;
END;

CREATE PROCEDURE ActualizarCampoOrden
    @id INT,
    @Campo NVARCHAR(50),
    @NuevoValor NVARCHAR(MAX)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @ColumnExists INT;

    SELECT @ColumnExists = COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Orden' AND COLUMN_NAME = @Campo;
    IF @ColumnExists = 0
    BEGIN
        RAISERROR('Campo no permitido', 16, 1);
        RETURN;
    END

    SET @sql = 'UPDATE Orden SET ' + QUOTENAME(@Campo) + ' = @NuevoValor WHERE idOrden = @id';

    EXEC sp_executesql @sql, N'@NuevoValor NVARCHAR(MAX), @id INT', @NuevoValor, @id;
END;


--Ejecucion de Procedures
EXEC CrearRoles 'Admin';
EXEC CrearRoles 'Cliente';


EXEC CrearEstados 'Activo';
EXEC CrearEstados 'Inactivo';


EXEC CrearClientes 'Razon Social Cliente A', 'ClienteA', 'Direccion A', '11111', 'clienteA@mail.com', 1, 'pass';
EXEC CrearClientes 'Razon Social Cliente B', 'ClienteB', 'Direccion B', '22222', 'clienteB@mail.com', 1, 'pass';
EXEC CrearClientes 'Trabajador de Empresa Comercial SA', 'Lester', 'Guatemala Calle B', '5556-1347', 'lestergeo96@gmail.com', 1, '$2b$10$XlVNL71gOIyb6QRUlk/5q.0qktZd3iSy7OO3GH3OrYh9zBQr5OH8K';

--pass L3ster2025@
EXEC CrearUsuarios 1, 1, 'lestergeo96@gmail.com', 'Lester Alonzo', '$2b$10$XlVNL71gOIyb6QRUlk/5q.0qktZd3iSy7OO3GH3OrYh9zBQr5OH8K', '1111111';
--EXEC CrearUsuarios 1, 1, 'userA@mail.com', 'Usuario A', 'pass', '2222222';
--EXEC CrearUsuarios 1, 1, 'userB@mail.com', 'Usuario B', 'pass', '3333333';


EXEC ActualizarCampoUsuario @id=2, @Campo='Clientes_idClientes', @NuevoValor='1';
EXEC ActualizarCampoUsuario @id=3, @Campo='Clientes_idClientes', @NuevoValor='2';


EXEC CrearCategorias 1, 'Electrónica', 1;


EXEC CrearProductos 1, 1, 'Laptop', 'MarcaX', 'CODLAP1', 10, 1, 15000, "fasfasfsadfds";
EXEC CrearProductos 1, 1, 'Smartphone', 'MarcaY', 'CODPH1', 20, 1, 3000, "fadfsafsadfasd";
EXEC CrearProductos 1, 1, 'Tablet', 'MarcaZ', 'CODTAB1', 5, 1, 5000, "fasfadfafasdfsaf";
EXEC CrearProductos 1, 1, 'Drone', 'MarcaX', 'CODDRO1', 10, 1, 25000, "https://petapixel.com/assets/uploads/2022/09/what-is-an-fpv-drone.jpg";


EXEC CrearOrdenes  NULL, 1, 'Cliente A', 'Direccion A', '11111', 'clienteA@mail.com', 20000, 1;
EXEC CrearOrdenes  NULL, 1, 'Cliente A', 'Direccion A', '11111', 'clienteA@mail.com', 10000, 1;
EXEC CrearOrdenes  NULL, 1, 'Cliente B', 'Direccion B', '22222', 'clienteB@mail.com', 3000, 2;


EXEC CrearOrdenDetalles 1, 1, 1, 15000, 15000;  -- Laptop
EXEC CrearOrdenDetalles 1, 2, 1, 3000, 3000;    -- Smartphone
EXEC CrearOrdenDetalles 1, 3, 1, 5000, 5000;    -- Tablet


EXEC CrearOrdenDetalles 2, 1, 1, 15000, 15000;


EXEC CrearOrdenDetalles 3, 2, 2, 3000, 6000;



EXEC InactivarProducto 1, 2;


-- Indices

--Clientes
CREATE INDEX idx_nombre_comercial ON Clientes(nombre_comercial);
CREATE INDEX idx_telefono ON Clientes(telefono);
CREATE INDEX idx_email ON Clientes(email);

-- usuarios
CREATE INDEX idx_rol_idrol ON usuarios(rol_idrol);
CREATE INDEX idx_estados_idestados ON usuarios(estados_idestados);
CREATE INDEX idx_correo_electronico ON usuarios(correo_electronico);
CREATE INDEX idx_Clientes_idClientes ON usuarios(Clientes_idClientes);
-- CategoriaProeductos
CREATE INDEX idx_usuarios_idusuarios ON CategoriaProductos(usuarios_idusuarios);
CREATE INDEX idx_estados_idestados ON CategoriaProductos(estados_idestados);
-- Productos
CREATE INDEX idx_CategoriaProductos_IDCategoria ON Productos(CategoriaProductos_IDCategoria);
CREATE INDEX idx_usuarios_idusuarios ON Productos(usuarios_idusuarios);
CREATE INDEX idx_estados_idestados ON Productos(estados_idestados);
CREATE INDEX idx_codigo ON Productos(codigo);
CREATE INDEX idx_nombre_marca ON Productos(nombre, marca);
--Orden
CREATE INDEX idx_usuarios_idusuarios ON Orden(usuarios_idusuarios);
CREATE INDEX idx_estados_idestados ON Orden(estados_idestados);
CREATE INDEX idx_fecha_creacion ON Orden(fecha_creacion);
--OrdenDetalle
CREATE INDEX idx_Orden_idOrden ON OrdenDetalles(Orden_idOrden);
CREATE INDEX idx_Productos_idProductos ON OrdenDetalles(Productos_idProductos);
--Auditoria
CREATE INDEX idx_tabla_accion ON Auditoria(tabla, accion);
CREATE INDEX idx_idRegistro ON Auditoria(idRegistro);
CREATE INDEX idx_fecha ON Auditoria(fecha);

-- Vistas
CREATE VIEW Vista_ProductosActivosConStock AS
SELECT COUNT(*) AS TotalProductosActivos
FROM Productos
WHERE estados_idestados = (SELECT idestados FROM estados WHERE nombre = 'Activo')
  AND stock > 0;

CREATE VIEW Vista_TotalOrdenesAgosto2024 AS
SELECT SUM(total_orden) AS TotalQuetzales
FROM Orden
-- ↓ En agosto
--WHERE MONTH(fecha_creacion) = 8 AND YEAR(fecha_creacion) = 2024;
WHERE MONTH(fecha_creacion) = 12 AND YEAR(fecha_creacion) = 2024;

CREATE VIEW Vista_Top10ClientesMayorConsumo AS
SELECT TOP 10 c.nombre_comercial, SUM(o.total_orden) AS TotalConsumo
FROM Clientes c
JOIN usuarios u ON c.idClientes = u.Clientes_idClientes
JOIN Orden o ON u.idusuarios = o.usuarios_idusuarios
GROUP BY c.nombre_comercial
ORDER BY TotalConsumo DESC;

CREATE VIEW Vista_Top10ProductosMasVendidos AS
SELECT TOP 10 p.nombre AS Producto, SUM(od.cantidad) AS TotalVendido
FROM Productos p
JOIN OrdenDetalles od ON p.idProductos = od.Productos_idProductos
GROUP BY p.nombre
ORDER BY TotalVendido ASC;

--Ejecutar Vistas
SELECT * FROM Vista_ProductosActivosConStock;
SELECT * FROM Vista_TotalOrdenesAgosto2024;
SELECT * FROM Vista_Top10ClientesMayorConsumo;
SELECT * FROM Vista_Top10ProductosMasVendidos;

--Resultados Finales
SELECT * FROM sys.triggers;
SELECT * FROM sys.tables;
SELECT * FROM sys.procedures;
SELECT * FROM sys.views;
SELECT * FROM Auditoria;
SELECT * FROM Productos;
SELECT * FROM estados;
SELECT * FROM rol;
SELECT * FROM usuarios;
SELECT * FROM Orden;
SELECT * FROM OrdenDetalles;
SELECT * FROM CategoriaProductos;
SELECT * FROM Clientes;
SELECT * FROM usuarios WHERE correo_electronico = N'admin@mail.com';
SELECT * FROM sys.databases;

--DELETE FROM Productos WHERE idProductos = 1;