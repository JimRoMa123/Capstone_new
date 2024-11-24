const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); // Importa el paquete CORS
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const app = express();
const port = 3000;
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const pool = new Pool({
  user: 'postgres', // Usuario de la base de datos
  host: 'erp-pyme.postgres.database.azure.com',
  database: 'postgres', 
  password: 'capstonePyme321/', 
  port: 5432, 
  ssl: {
      rejectUnauthorized: false 
  }
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

// Ejemplo en tu endpoint de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, password FROM auth_user WHERE username = $1',
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
      'SELECT id, username, email FROM auth_user WHERE id = $1',
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
  const { nombre, direccion, telefono, email,  fecha_creacion, fecha_actualizacion, comuna_id, region_id, giro_id, logo, rut, user_id =1 } = req.body;

  if (!nombre || !direccion || !telefono || !email || !fecha_creacion || !fecha_actualizacion || !comuna_id || !region_id || !giro_id || !rut ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios pico' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO proveedor (nombre, direccion, telefono, email,  fecha_creacion, fecha_actualizacion, comuna_id, region_id, giro_id, logo, rut, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [nombre, direccion, telefono, email,  fecha_creacion, fecha_actualizacion, comuna_id, region_id, giro_id, logo, rut, user_id]
    );

    res.status(201).json({ message: 'proveedor agregado correctamente', proveedor: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ message: 'Error al agregar proveedor', error });
  }
});

app.post('/add-proveedor_pedido', async (req, res) => {
  const { fecha_pedido, total, estado, proveedor_id, productos } = req.body;

  if (!fecha_pedido || !total || !estado || !proveedor_id || !productos) {
    return res.status(400).json({ message: 'Faltan datos obligatorios del pedido' });
  }

  try {
    // Crear el pedido en la tabla 'pedido' y obtener el pedido_id
    const pedidoResult = await pool.query(
      'INSERT INTO pedido (fecha_pedido, total, estado, proveedor_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [fecha_pedido, total, estado, proveedor_id]
    );
    const pedidoId = pedidoResult.rows[0].id; // Obtenemos el ID del pedido creado

    // Insertar los productos en la tabla 'detalle_pedido' con el pedido_id
    for (const producto of productos) {
      const subtotal = producto.cantidad * producto.precio_unitario; // Calculamos el subtotal
      await pool.query(
        'INSERT INTO detalle_pedido (cantidad, precio_unitario, subtotal, fecha_creacion, pedido_id, proveedor_id, producto_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          producto.cantidad, 
          producto.precio_unitario, 
          subtotal, 
          new Date(), // fecha_creacion
          pedidoId, 
          proveedor_id, 
          producto.producto_id
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

  if (!nombre || !descripcion || !img || !fecha_creacion || !user_id  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios del pedido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categoria (nombre, descripcion, img, fecha_creacion, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, img, fecha_creacion,  user_id]
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
  } = req.body;

  // Campos fijos
  const user_id = 1;
  const bodega_id = 1;
  const fecha_creacion = new Date(); // Fecha actual en el servidor como fecha de creación

  // Verificación de campos obligatorios
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
      (nombre, descripcion, img, sku, proveedor_id, categoria_id, cantidad, porc_ganancias, 
      fecha_creacion, bodega_id, user_id, precio_compra, precio_venta) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        nombre,
        descripcion,
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
      SELECT p.id, p.total, p.estado, p.fecha_pedido, prov.nombre AS proveedor_nombre
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

