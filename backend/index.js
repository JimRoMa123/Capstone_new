const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Configuración de la base de datos PostgreSQL en AWS


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

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Consulta simple
    res.status(200).json({ message: 'Base de datos conectada', data: result.rows });
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    res.status(500).json({ message: 'Error conectando a la base de datos', error });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
