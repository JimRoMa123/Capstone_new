const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit'); // Importar pdfkit

const app = express();
const port = 3000;
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const pool = new Pool({
  user: 'postgres',
  host: 'erp-pyme.postgres.database.azure.com',
  database: 'postgres',
  password: 'capstonePyme321/',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.json());



app.post('/add-cliente', async (req, res) => {
  const { nombre, apellido, direccion, telefono, email, fecha_nacimiento, genero, fecha_creacion, rut, user_id=1 } = req.body;

  if (!nombre || !apellido || !direccion || !telefono || !email || !fecha_nacimiento || !genero || !fecha_creacion|| !rut) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO cliente (nombre, apellido, direccion, telefono, email, fecha_nacimiento, genero, fecha_creacion, rut, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [nombre, apellido, direccion, telefono, email, fecha_nacimiento, genero, fecha_creacion, rut, user_id]
    );

    res.status(201).json({ message: 'Cliente agregado correctamente', cliente: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    res.status(500).json({ message: 'Error al agregar cliente', error });
  }
});


app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});



function verifyPassword(inputPassword, hashedPassword) {
  // Descomponer el hash en su formato original: algoritmo$iteraciones$salt$hash
  const [algorithm, iterations, salt, hash] = hashedPassword.split('$');
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(inputPassword, salt, parseInt(iterations), 32, algorithm, (err, derivedKey) => {
      if (err) reject(err);
      // Convertir el hash calculado a base64 y compararlo con el hash almacenado
      resolve(derivedKey.toString('base64') === hash);
    });
  });
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, password FROM user_customuser WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const storedHash = user.password;

    // Desglosa el hash almacenado
    const [algorithm, iterations, salt, originalHash] = storedHash.split('$');

    // Convierte las iteraciones a número
    const iterationsInt = parseInt(iterations);

    // Calcula el hash de la contraseña ingresada
    crypto.pbkdf2(password, salt, iterationsInt, 32, 'sha256', (err, derivedKey) => {
      if (err) {
        console.error('Error al verificar la contraseña:', err);
        return res.status(500).json({ message: 'Error al iniciar sesión', error: err });
      }

      const derivedHash = derivedKey.toString('base64');

      // Compara el hash calculado con el hash original
      if (derivedHash === originalHash) {
        // Genera un token de sesión
        const token = jwt.sign({ id: user.id, username }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});




app.get('/list-tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
    res.status(200).json({ message: 'Tablas en la base de datos', data: result.rows });
  } catch (error) {
    console.error('Error al listar tablas:', error);
    res.status(500).json({ message: 'Error al listar tablas', error });
  }
});
app.get('/table/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} ;`); 
    res.status(200).json({ message: `Datos de la tabla ${tableName}`, data: result.rows });
  } catch (error) {
    console.error(`Error consultando la tabla ${tableName}:`, error);
    res.status(500).json({ message: `Error consultando la tabla ${tableName}`, error });
  }


  
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email FROM user_customuser WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userProfile = result.rows[0];
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    res.status(500).json({ message: 'Error al obtener perfil del usuario', error });
  }
});

app.post('/add-proveedor', async (req, res) => {
  const {
    nombre,
    direccion,
    telefono,
    email,
    fecha_creacion,
    fecha_actualizacion,
    comuna_id,
    region_id,
    giro_id,
    logo,
    rut,
    latitud,
    longitud, 
    user_id = 1,
  } = req.body;

  // Validar que los datos obligatorios estén presentes
  if (
    !nombre ||
    !direccion ||
    !telefono ||
    !email ||
    !fecha_creacion ||
    !fecha_actualizacion ||
    !comuna_id ||
    !region_id ||
    !giro_id ||
    !rut 
  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    // Insertar en la base de datos
    const result = await pool.query(
      'INSERT INTO proveedor (nombre, direccion, telefono, email, fecha_creacion, fecha_actualizacion, comuna_id, region_id, giro_id, logo, rut, latitud, longitud, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [
        nombre,
        direccion,
        telefono,
        email,
        fecha_creacion,
        fecha_actualizacion,
        comuna_id,
        region_id,
        giro_id,
        logo,
        rut,
        latitud, // Insertar latitud
        longitud, // Insertar longitud
        user_id,
      ]
    );

    res.status(201).json({
      message: 'Proveedor agregado correctamente',
      proveedor: result.rows[0],
    });
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ message: 'Error al agregar proveedor', error });
  }
});


app.post('/add-proveedor_pedido', async (req, res) => {
  const { fecha_pedido, total, estado, proveedor_id, productos, user_id = 1, created_by_id = 1, direccion_entrega_id } = req.body;

  if (!fecha_pedido || !total || !estado || !proveedor_id || !productos) {
    return res.status(400).json({ message: 'Faltan datos obligatorios del pedido' });
  }

  try {
    // Crear el pedido en la tabla 'pedido' y obtener el pedido_id
    const pedidoResult = await pool.query(
      'INSERT INTO pedido (fecha_creacion, total, estado, proveedor_id, user_id, created_by_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [fecha_pedido, total, estado, proveedor_id, user_id, created_by_id]
    );
    const pedidoId = pedidoResult.rows[0].id; // Obtenemos el ID del pedido creado

    // Insertar los productos en la tabla 'detalle_pedido' con el pedido_id
    for (const producto of productos) {
      await pool.query(
        'INSERT INTO detalle_pedido (cantidad, precio_unitario, pedido_id, producto_id, user_id, proveedor_id, fecha_creacion, direccion_entrega_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          producto.cantidad, 
          producto.precio_unitario, 
          pedidoId, 
          producto.producto_id,
          1,
          proveedor_id,
          fecha_pedido,
          direccion_entrega_id // Utilizamos la bodega seleccionada enviada desde el front
        ]
      );
    }

    res.status(201).json({ message: 'Pedido y productos agregados correctamente en detalle_pedido' });
  } catch (error) {
    console.error('Error al agregar pedido:', error);
    res.status(500).json({ message: 'Error al agregar pedido', error });
  }
});

app.post('/add-categoria', async (req, res) => {
  const { nombre, descripcion, img, fecha_creacion,  user_id =1} = req.body;

  if (!nombre || !descripcion || !fecha_creacion || !user_id  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios del pedido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categoria (nombre, descripcion,  fecha_creacion, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, fecha_creacion,  user_id]
    );

    res.status(201).json({ message: 'categoria agregado correctamente', categoria: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar:', error);
    res.status(500).json({ message: 'Error al agregar', error });
  }
});

app.post('/add-producto', async (req, res) => {
  const {
    nombre,
    descripcion,
    img,
    sku,
    proveedor_id,
    categoria_id,
    cantidad,
    porc_ganancias,
    precio_compra,
    precio_venta,
    bodega_id, // Asegúrate de recibir este campo
  } = req.body;

  // Campos fijos
  const user_id = 1;
  const iva = 19
  const fecha_creacion = new Date(); 
  if (
    !nombre ||
    !descripcion ||
    !img ||
    !sku ||
    !proveedor_id ||
    !categoria_id ||
    !cantidad ||
    !porc_ganancias ||
    !precio_compra ||
    !precio_venta
  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios del producto' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO producto 
      (nombre,iva, img, sku, proveedor_id, categoria_id, cantidad, porc_ganancias, 
      fecha_creacion, bodega_id, user_id, precio_compra, precio_venta) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        nombre,
        iva,
        img,
        sku,
        proveedor_id,
        categoria_id,
        cantidad,
        porc_ganancias,
        fecha_creacion,
        bodega_id,
        user_id,
        precio_compra,
        precio_venta,
      ]
    );

    res.status(201).json({ message: 'Producto agregado correctamente', producto: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto', error });
  }
});

app.get('/productos-por-proveedor/:proveedorId', async (req, res) => {
  const { proveedorId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM producto WHERE proveedor_id = $1',
      [proveedorId]
    );
    res.status(200).json({ message: 'Productos del proveedor obtenidos', data: result.rows });
  } catch (error) {
    console.error('Error al obtener productos del proveedor:', error);
    res.status(500).json({ message: 'Error al obtener productos del proveedor', error });
  }
});

app.get('/pedidos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.total, p.estado, p.fecha_creacion, prov.nombre AS proveedor_nombre
      FROM pedido p
      JOIN proveedor prov ON p.proveedor_id = prov.id
    `);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
});

app.get('/detalle-pedido/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  try {
    const result = await pool.query(`
      SELECT dp.*, p.nombre AS producto_nombre, prov.nombre AS proveedor_nombre
      FROM detalle_pedido dp
      JOIN producto p ON dp.producto_id = p.id
      JOIN proveedor prov ON dp.proveedor_id = prov.id
      WHERE dp.pedido_id = $1
    `, [pedidoId]);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener detalle del pedido:', error);
    res.status(500).json({ message: 'Error al obtener detalle del pedido', error });
  }
});

app.post('/add-venta', async (req, res) => {
  const { metodo_pago, estado, cliente_id, user_id, productos } = req.body;
  const impuesto = 19;
  if ( !metodo_pago || !estado || !cliente_id || !user_id || !productos || productos.length === 0) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para crear la venta.' });
  }

  try {
    // Insertar la venta en la tabla `venta`
    const ventaResult = await pool.query(
      'INSERT INTO venta ( metodo_pago, estado, cliente_id, fecha_creacion, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [ metodo_pago, estado, cliente_id, new Date(), user_id]
    );

    const ventaId = ventaResult.rows[0].id;

    // Insertar los detalles de la venta en `detalle_venta`
    for (const producto of productos) {
      const subtotal = producto.cantidad * producto.precio_unitario; // Subtotal sin impuesto
      const descuentoAplicado = subtotal * (producto.descuento / 100 || 0); // Descuento en dinero
      const totalConImpuesto = (subtotal - descuentoAplicado) * (1 + impuesto / 100); // Total con impuesto

      await pool.query(
        'INSERT INTO detalle_venta (cantidad, precio_unitario, descuento, producto_id, venta_id, user_id, total_venta, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          producto.cantidad,
          producto.precio_unitario,
          producto.descuento || 0,
          producto.producto_id,
          ventaId,
          user_id,
          totalConImpuesto.toFixed(2),
          new Date()
        ]
      );
    }

    res.status(201).json({ message: 'Venta y detalles registrados correctamente', ventaId });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
});


app.get('/ventas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id,  v.metodo_pago, v.estado, v.fecha_creacion, 
             c.nombre AS cliente_nombre, c.apellido AS cliente_apellido, 
             u.username AS usuario
      FROM venta v
      JOIN cliente c ON v.cliente_id = c.id
      JOIN user_customuser u ON v.user_id = u.id
      WHERE DATE_PART('month', v.fecha_creacion) = DATE_PART('month', CURRENT_DATE)
      AND DATE_PART('year', v.fecha_creacion) = DATE_PART('year', CURRENT_DATE)
    `);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
});


app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, sku, nombre, precio_venta, cantidad
      FROM producto
    `);
    res.status(200).json({ message: 'Productos obtenidos correctamente', data: result.rows });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
});

app.get('/detalle-venta/:ventaId', async (req, res) => {
  const { ventaId } = req.params;

  try {
    const result = await pool.query(`
      SELECT dv.cantidad, dv.precio_unitario, dv.descuento, dv.total_venta, 
             p.nombre
      FROM detalle_venta dv
      JOIN producto p ON dv.producto_id = p.id
      WHERE dv.venta_id = $1
    `, [ventaId]);

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener el detalle de la venta:', error);
    res.status(500).json({ message: 'Error al obtener el detalle de la venta', error });
  }
});

app.put('/update-proveedor/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email, latitud, longitud } = req.body;

  try {
    const result = await pool.query(
      'UPDATE proveedor SET nombre = $1, direccion = $2, telefono = $3, email = $4, latitud = $5, longitud = $6 WHERE id = $7 RETURNING *',
      [nombre, direccion, telefono, email, latitud, longitud, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    res.status(200).json({ message: 'Proveedor actualizado', proveedor: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ message: 'Error al actualizar proveedor', error });
  }
});
// Endpoint para actualizar un cliente
app.put('/update-cliente/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, direccion, telefono, email } = req.body;

  // Validar datos obligatorios
  if (!nombre || !apellido || !direccion || !telefono || !email) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    // Actualizar el cliente en la base de datos
    const result = await pool.query(
      `UPDATE cliente 
       SET nombre = $1, apellido = $2, direccion = $3, telefono = $4, email = $5
       WHERE id = $6 RETURNING *`,
      [nombre, apellido, direccion, telefono, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json({ message: 'Cliente actualizado', cliente: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar cliente', error });
  }
});

app.get('/ventas-mes', async (req, res) => {
  try {
    const result = await pool.query(
      `WITH semanas AS (
  SELECT 
    generate_series(
      date_trunc('month', CURRENT_DATE), 
      date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day',
      '1 week'
    ) AS inicio_semana
),
ventas_semanales AS (
  SELECT 
    COUNT(v.id) AS total_ventas,
    s.inicio_semana
  FROM semanas s
  LEFT JOIN venta v 
    ON v.fecha_creacion >= s.inicio_semana 
   AND v.fecha_creacion < s.inicio_semana + interval '1 week'
  GROUP BY s.inicio_semana
  ORDER BY s.inicio_semana
)
SELECT 
  (SELECT COUNT(*) FROM venta WHERE EXTRACT(MONTH FROM fecha_creacion) = EXTRACT(MONTH FROM CURRENT_DATE)) AS total_ventas,
  ARRAY(
    SELECT COALESCE(total_ventas, 0)
    FROM ventas_semanales
  ) AS ventas_semanales
FROM ventas_semanales
LIMIT 1;

`
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener ventas del mes:', error);
    res.status(500).json({ message: 'Error al obtener ventas del mes' });
  }
});



app.get('/estado-compras', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT estado, COUNT(*) AS total 
      FROM pedido 
      GROUP BY estado
      ORDER BY estado
    `);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No hay pedidos en el sistema' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener estado de las compras:', error);
    res.status(500).json({ message: 'Error al obtener estado de las compras' });
  }
});

app.get('/total-proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM proveedor');
    res.status(200).json(result.rows[0].total);
  } catch (error) {
    console.error('Error al obtener total de proveedores:', error);
    res.status(500).json({ message: 'Error al obtener total de proveedores' });
  }
});

app.get('/top-clientes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.nombre, c.apellido, COUNT(v.id) AS total_compras
      FROM cliente c
      JOIN venta v ON v.cliente_id = c.id
      GROUP BY c.id
      ORDER BY total_compras DESC
      LIMIT 5
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener top clientes:', error);
    res.status(500).json({ message: 'Error al obtener top clientes' });
  }
});

app.get('/proveedor-estrella', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nombre, COUNT(dv.id) AS total_ventas
      FROM proveedor p
      JOIN detalle_pedido dv ON dv.proveedor_id = p.id
      GROUP BY p.id
      ORDER BY total_ventas DESC
      LIMIT 1
    `);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener proveedor estrella:', error);
    res.status(500).json({ message: 'Error al obtener proveedor estrella' });
  }
});

// Endpoint para obtener provincias por región
app.get('/provincias/:regionId', async (req, res) => {
  const { regionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM provincia WHERE region_id = $1 ORDER BY nombre',
      [regionId]
    );
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    res.status(500).json({ message: 'Error al obtener provincias', error });
  }
});

// Endpoint para obtener comunas por provincia
app.get('/comunas/:provinciaId', async (req, res) => {
  const { provinciaId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM comuna WHERE provincia_id = $1 ORDER BY nombre',
      [provinciaId]
    );
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    res.status(500).json({ message: 'Error al obtener comunas', error });
  }
});

app.post('/add-bodega', async (req, res) => {
  const {
    nombre,
    direccion,
    capacidad,
    cantidad_art,
    fecha_creacion,
    comuna_id,
    provincia_id,
    region_id,
    user_id= 1,
  } = req.body;

  if (
    !nombre ||
    !direccion ||
    !capacidad ||
    !cantidad_art ||
    !comuna_id ||
    !provincia_id ||
    !region_id ||
    !user_id
  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bodega (nombre, direccion, capacidad, cantidad_art, fecha_creacion, comuna_id, provincia_id, region_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nombre, direccion, capacidad, cantidad_art, fecha_creacion, comuna_id, provincia_id, region_id, user_id]
    );
    res.status(201).json({ message: 'Bodega creada exitosamente', bodega: result.rows[0] });
  } catch (error) {
    console.error('Error al crear la bodega:', error);
    res.status(500).json({ message: 'Error al crear la bodega', error });
  }
});

// Ejemplo en Node.js/Express
app.get('/bodegas', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bodega ORDER BY nombre',
    );
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    res.status(500).json({ message: 'Error al obtener comunas', error });
  }
});

// Endpoint para obtener productos de una bodega específica
app.get('/productos/bodega/:bodegaId', async (req, res) => {
  const { bodegaId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM producto WHERE bodega_id = $1 ORDER BY nombre`,
      [bodegaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos para esta bodega.' });
    }

    res.status(200).json({ message: 'Productos obtenidos exitosamente', data: result.rows });
  } catch (error) {
    console.error('Error al obtener productos de la bodega:', error);
    res.status(500).json({ message: 'Error al obtener productos de la bodega', error });
  }
});

app.get('/transferencias-mes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS count
      FROM venta
      WHERE metodo_pago = 'Transferencia'
        AND DATE_PART('month', fecha_creacion) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', fecha_creacion) = DATE_PART('year', CURRENT_DATE)
    `);
    res.status(200).json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error al contar transferencias del mes:', error);
    res.status(500).json({ message: 'Error al contar transferencias del mes' });
  }
});

// Ejemplo en Node.js/Express
// Ruta: PATCH /ventas/:id
app.patch('/ventas/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Estado nuevo de la venta
  if (!['Completada', 'Pendiente', 'Eliminada'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' } );
  }

  try {
    // Actualizar la venta en la base de datos
    await pool.query(
      'UPDATE venta SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    return res.json({ message: 'Estado de venta actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado de venta:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Suponiendo que tienes instalado pdfmake: npm install pdfmake
function fitText(doc, text, width) {
  let truncated = text;
  // Mientras el texto sea más ancho que la columna, quitar el último carácter
  while (truncated.length > 0 && doc.widthOfString(truncated) > width) {
    truncated = truncated.slice(0, -1);
  }
  return truncated;
}


app.get('/reporte-mensual', async (req, res) => {
  try {
    // Obtención de datos (igual que en tu ejemplo)
    const comprasResult = await pool.query(`
      SELECT prov.nombre AS proveedor, p.nombre AS producto, dp.precio_unitario, dp.fecha_creacion AS fecha
      FROM detalle_pedido dp
      JOIN producto p ON dp.producto_id = p.id
      JOIN proveedor prov ON dp.proveedor_id = prov.id
      WHERE DATE_PART('month', dp.fecha_creacion) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', dp.fecha_creacion) = DATE_PART('year', CURRENT_DATE)
    `);

    let totalCompras = 0;
    const comprasData = comprasResult.rows.map((row) => {
      totalCompras += parseFloat(row.precio_unitario);
      return {
        proveedor: row.proveedor,
        producto: row.producto,
        precio_unitario: row.precio_unitario.toString(),
        fecha: new Date(row.fecha).toLocaleDateString(),
      };
    });

    const ventasResult = await pool.query(`
      SELECT v.id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido, v.fecha_creacion, v.estado, v.metodo_pago
      FROM venta v
      JOIN cliente c ON v.cliente_id = c.id
      WHERE DATE_PART('month', v.fecha_creacion) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', v.fecha_creacion) = DATE_PART('year', CURRENT_DATE)
    `);

    let totalVentas = 0;
    let ventasData = [];

    for (const venta of ventasResult.rows) {
      const detalle = await pool.query(`
        SELECT p.nombre, dv.cantidad, dv.precio_unitario, dv.total_venta
        FROM detalle_venta dv
        JOIN producto p ON dv.producto_id = p.id
        WHERE dv.venta_id = $1
      `, [venta.id]);

      detalle.rows.forEach((producto) => {
        totalVentas += parseFloat(producto.total_venta);
        ventasData.push({
          cliente: `${venta.cliente_nombre} ${venta.cliente_apellido}`,
          producto: producto.nombre,
          cantidad: producto.cantidad.toString(),
          precio_unit: producto.precio_unitario.toString(),
          total_venta: producto.total_venta.toString(),
          fecha: new Date(venta.fecha_creacion).toLocaleDateString(),
        });
      });
    }

    const proveedorEstrellaResp = await pool.query(`
      SELECT p.nombre, COUNT(dv.id) AS total_ventas
      FROM proveedor p
      JOIN detalle_pedido dv ON dv.proveedor_id = p.id
      GROUP BY p.id
      ORDER BY total_ventas DESC
      LIMIT 1
    `);
    const proveedorEstrella = proveedorEstrellaResp.rows[0];

    const topClientesResp = await pool.query(`
      SELECT c.nombre, c.apellido, COUNT(v.id) AS total_compras
      FROM cliente c
      JOIN venta v ON v.cliente_id = c.id
      GROUP BY c.id
      ORDER BY total_compras DESC
      LIMIT 5
    `);
    const topClientes = topClientesResp.rows.map(
      (tc) => `${tc.nombre} ${tc.apellido}: ${tc.total_compras} compras`
    );

    const totalVentasResp = await pool.query(`
      SELECT COUNT(*)::int AS total_ventas_mes FROM venta
      WHERE DATE_PART('month', fecha_creacion) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', fecha_creacion) = DATE_PART('year', CURRENT_DATE)
    `);
    const totalVentasMes = totalVentasResp.rows[0].total_ventas_mes;

    const completadasResp = await pool.query(`
      SELECT COUNT(*)::int AS completadas FROM venta
      WHERE estado = 'completada'
        AND DATE_PART('month', fecha_creacion) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', fecha_creacion) = DATE_PART('year', CURRENT_DATE)
    `);
    const completadasCount = completadasResp.rows[0].completadas;
    const porcentajeCompletadas =
      totalVentasMes > 0
        ? ((completadasCount / totalVentasMes) * 100).toFixed(2) + '%'
        : '0%';

    // Crear documento PDF con pdfkit
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_mensual.pdf"');
    doc.pipe(res);

    // Estilos generales
    doc.font('Helvetica');

    // Título principal
    doc.fontSize(20).text('Reporte Mensual', { align: 'center' });
    doc.moveDown(2);

    // Página 1: Compras
    doc.font('Helvetica-Bold').fontSize(14).text('Página 1: Compras a Proveedores', { align: 'left' });
    doc.moveDown(0.5);
    // Línea roja
    doc.moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor('red').lineWidth(2).stroke();
    doc.moveDown(1);

    // Tabla de Compras
    doc.fontSize(12).font('Helvetica-Bold');
    const startX = doc.x;
    let currentY = doc.y;
    const col1 = 120;
    const col2 = 100;
    const col3 = 100;
    const col4 = 100;

    doc.text('Proveedor', startX, currentY, { width: col1 });
    doc.text('Item', startX + col1, currentY, { width: col2 });
    doc.text('Costo U.', startX + col1 + col2, currentY, { width: col3 });
    doc.text('Fecha', startX + col1 + col2 + col3, currentY, { width: col4 });

    currentY += 20;
    doc.moveTo(startX, currentY)
      .lineTo(startX + col1 + col2 + col3 + col4, currentY)
      .strokeColor('red').lineWidth(1).stroke();
    currentY += 10;

    doc.font('Helvetica').fontSize(12);
    comprasData.forEach((c) => {
      let prov = fitText(doc, c.proveedor, col1);
      let prod = fitText(doc, c.producto, col2);
      let precio = fitText(doc, c.precio_unitario, col3);
      let fec = fitText(doc, c.fecha, col4);

      doc.text(prov, startX, currentY, { width: col1, align:'justify', lineBreak:false });
      doc.text(prod, startX + col1, currentY, { width: col2, align:'justify', lineBreak:false });
      doc.text(precio, startX + col1 + col2, currentY, { width: col3, align:'justify', lineBreak:false });
      doc.text(fec, startX + col1 + col2 + col3, currentY, { width: col4, align:'justify', lineBreak:false });
      currentY += 20;
    });

    doc.moveTo(startX, currentY)
      .lineTo(startX + col1 + col2 + col3 + col4, currentY)
      .strokeColor('red').lineWidth(1).stroke();
    doc.moveDown(1).text(`Total de Compras: ${totalCompras.toFixed(2)}`, { align:'justify' });

    // Página 2: Ventas
    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(14).text('Página 2: Ventas', { align:'left' });
    doc.moveDown(0.5);
    doc.moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor('red').lineWidth(2).stroke();
    doc.moveDown(1);

    // Cabecera Ventas
    doc.font('Helvetica-Bold').fontSize(12);
    const vStartX = doc.x;
    let vCurrentY = doc.y;
    const vCol = 80;

    doc.text('Cliente', vStartX, vCurrentY, { width: vCol });
    doc.text('Producto', vStartX+vCol, vCurrentY, { width: vCol });
    doc.text('Cantidad', vStartX+vCol*2, vCurrentY, { width: vCol });
    doc.text('P.Unit', vStartX+vCol*3, vCurrentY, { width: vCol });
    doc.text('Total', vStartX+vCol*4, vCurrentY, { width: vCol });
    doc.text('Fecha', vStartX+vCol*5, vCurrentY, { width: vCol });

    vCurrentY += 20;
    doc.moveTo(vStartX, vCurrentY)
      .lineTo(vStartX+vCol*6, vCurrentY)
      .strokeColor('red').lineWidth(1).stroke();
    vCurrentY += 10;

    doc.font('Helvetica').fontSize(12);
    ventasData.forEach((v) => {
      let cli = fitText(doc, v.cliente, vCol);
      let prod = fitText(doc, v.producto, vCol);
      let cant = fitText(doc, v.cantidad, vCol);
      let punit = fitText(doc, v.precio_unit, vCol);
      let tot = fitText(doc, v.total_venta, vCol);
      let fec = fitText(doc, v.fecha, vCol);

      doc.text(cli, vStartX, vCurrentY, { width: vCol, align:'justify', lineBreak:false });
      doc.text(prod, vStartX+vCol, vCurrentY, { width: vCol, align:'justify', lineBreak:false });
      doc.text(cant, vStartX+vCol*2, vCurrentY, { width: vCol, align:'justify', lineBreak:false });
      doc.text(punit, vStartX+vCol*3, vCurrentY, { width: vCol, align:'justify', lineBreak:false });
      doc.text(tot, vStartX+vCol*4, vCurrentY, { width: vCol, align:'justify', lineBreak:false });
      doc.text(fec, vStartX+vCol*5, vCurrentY, { width: vCol, align:'justify', lineBreak:false });

      vCurrentY += 20;
    });

    doc.moveDown(1).text(`Total de Ventas: ${totalVentas.toFixed(2)}`, { align:'justify' });

    // Página 3: Estadísticas
    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(14).text('Página 3: Estadísticas Globales', { align:'left' });
    doc.moveDown(0.5);
    doc.moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor('red').lineWidth(2).stroke();
    doc.moveDown(1);

    doc.font('Helvetica').fontSize(12);
    let proveedorText = proveedorEstrella
      ? `${proveedorEstrella.nombre} con ${proveedorEstrella.total_ventas} ventas`
      : 'No disponible';
    doc.text(`Proveedor Estrella: ${proveedorText}`, { align:'justify' });
    doc.moveDown(1).text('Top Clientes:', { align:'justify' });

    topClientes.forEach(tc => {
      doc.text(tc, { align:'justify' });
    });


    doc.end();

  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ message: 'Error al generar el reporte' });
  }
});