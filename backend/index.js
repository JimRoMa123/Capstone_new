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
    user: 'postgres',
    host: 'capstone-pyme.c7gago4iy9g8.us-east-2.rds.amazonaws.com',
    database: 'postgres_pyme',
    password: 'postgres',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Cambia esto según tus necesidades de seguridad
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
    const result = await pool.query(`SELECT * FROM ${tableName} LIMIT 10;`); 
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
  const { nombre, direccion, telefono, email,  fecha_creacion, fecha_actualizacion} = req.body;

  if (!nombre || !direccion || !telefono || !email || !fecha_creacion || !fecha_actualizacion) {
    return res.status(400).json({ message: 'Faltan datos obligatorios pico' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO proveedor_proveedor (nombre, direccion, telefono, email,  fecha_creacion, fecha_actualizacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, direccion, telefono, email,  fecha_creacion, fecha_actualizacion]
    );

    res.status(201).json({ message: 'proveedor agregado correctamente', proveedor_proveedor: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ message: 'Error al agregar proveedor', error });
  }
});

app.post('/add-proveedor_pedido', async (req, res) => {
  const { fecha_pedido, total, estado, proveedor_id,  nombreProveedor, pedido} = req.body;

  if (!fecha_pedido || !total || !estado || !proveedor_id || !nombreProveedor || !pedido ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios del pedido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO proveedor_pedido (fecha_pedido, total, estado, proveedor_id, nombre_proveedor, pedido) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fecha_pedido, total, estado, proveedor_id,  nombreProveedor, pedido]
    );

    res.status(201).json({ message: 'pedido agregado correctamente', proveedor_pedido: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar pedido:', error);
    res.status(500).json({ message: 'Error al agregar pedido', error });
  }
});
