// desestructuración {}
import {createPool} from 'mysql2/promise'; 

/*export const conn = createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: 3306,
  database: 'Proyecto'
});*/

export const conn = createPool({
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5676911',
  password: 'NJtIba2jHi',
  port: 3306,
  database: 'sql5676911'
});




try {
    await conn.query('SELECT 1'); // Intenta realizar una consulta sencilla
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
  }