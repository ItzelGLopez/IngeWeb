import express from 'express';
import { conn } from '../db.js';
import { createHash } from 'crypto';

const app = express();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// POST
app.post('/registro', async (req, res) => {
    const { username, useremail, userpasswd1, userquestion, useranswer, userposition } = req.body;
    //let hash = createHash("md5").update(userpasswd1).digest("hex");
    let anshash = createHash("md5").update(useranswer).digest("hex");

    try {
        const [results] = await conn.execute('INSERT INTO `Proyecto.Usuario` (username, useremail,userpasswd, userquestion,useranswer,userposition) VALUES (?, ?, ?,?,?,?)', [username, useremail, userpasswd1, userquestion, anshash, userposition]);
        
        console.log('Resultado de la inserción:', results);

        res.json(results);
    } catch (error) {
        console.error('Error al insertar usuario:', error);

        // Manejo del error de duplicación de entrada
        if (error.code === 'ER_DUP_ENTRY') {
            const match = error.sqlMessage.match(/Duplicate entry '(.+)' for key '.+'/);
            const duplicateValue = match && match[1];
            res.status(409).json({ msg: `El valor '${duplicateValue}' ya existe en la base de datos` });
        } else {
            res.status(500).json({ msg: 'Error al insertar usuario' });
        }
    }
});


app.post('/login', async (req, res) => {
    const { username, hash } = req.body;
    
    try {
        const [results] = await conn.execute('SELECT * FROM `Proyecto.Usuario` WHERE username = ?', [username]);

        if (results && results.length > 0) {
            
            if (results[0].userpasswd === hash) {
                res.json(results[0]);
            } else {
                res.status(401).json({ msg: 'Credenciales inválidas' });
            }
            
        } else {
            res.status(404).json({ msg: 'Usuario no encontrado' });
            res.json(results[0]);

        }

    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});
app.post('/carrito', async (req, res) => {
    const { username, nombres, thumbnails, size } = req.body;

    try {
        const [results] = await conn.execute(
            'INSERT INTO `Proyecto.Carrito` (username, usertotalitems, charname, thumbnail) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE charname = ?, thumbnail = ?, usertotalitems = ?',
            [username, size, nombres, thumbnails, nombres, thumbnails,size]
        );

        console.log('Resultado de la inserción:', results);

        res.json(results);
    } catch (error) {
        console.error('Error al insertar usuario:', error);

        // Manejo del error de duplicación de entrada
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ msg: `La entrada para '${username}' ya existe en la base de datos` });
        } else {
            res.status(500).json({ msg: 'Error al insertar usuario' });
        }
    }
});


app.post('/usuarioc', async (req, res) => {
    const {useremail} = req.body;
    try {
        const [rows] = await conn.execute('SELECT useranswer,userquestion,username FROM `Proyecto.Usuario` WHERE useremail = ?', [useremail]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});

// GET
app.get('/users', async (req, res) => {
    try {
        const [rows] = await conn.query('SELECT * FROM `Proyecto.Usuario`');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});


//POST
app.post('/updateun', async (req, res) => {
    const { username, username2 } = req.body;
  
    try {
      const [results, fields] = await conn.execute('UPDATE `Proyecto.Usuario` SET username = ? WHERE username = ?', [username2, username]);
  

      if (results.affectedRows > 0) {
  
        res.json({ msg: 'Usuario actualizado exitosamente' });
      } else {

        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

app.post('/updateue', async (req, res) => {
    const { username, useremail } = req.body;
  
    try {
      const [results, fields] = await conn.execute('UPDATE `Proyecto.Usuario` SET useremail = ? WHERE username = ?', [useremail, username]);
  

      if (results.affectedRows > 0) {
  
        res.json({ msg: 'Usuario actualizado exitosamente' });
      } else {

        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

app.post('/updateuq', async (req, res) => {
    const { username, userquestion } = req.body;
  
    try {
      const [results, fields] = await conn.execute('UPDATE `Proyecto.Usuario` SET userquestion = ? WHERE username = ?', [userquestion, username]);
  

      if (results.affectedRows > 0) {
  
        res.json({ msg: 'Usuario actualizado exitosamente' });
      } else {

        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

app.post('/updateua', async (req, res) => {
    const { username, hash } = req.body;
  
    try {
      const [results, fields] = await conn.execute('UPDATE `Proyecto.Usuario` SET useranswer = ? WHERE username = ?', [hash, username]);
  

      if (results.affectedRows > 0) {
  
        res.json({ msg: 'Usuario actualizado exitosamente' });
      } else {

        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

app.post('/updateup', async (req, res) => {
    const { username, userposition } = req.body;
  
    try {

      const [results, fields] = await conn.execute('UPDATE `Proyecto.Usuario` SET userposition = ? WHERE username = ?', [userposition, username]);
  

      if (results.affectedRows > 0) {
  
        res.json({ msg: 'Usuario actualizado exitosamente' });
      } else {

        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

app.post('/cambiarc', async (req, res) => {
    const { userpasswd1, useremail } = req.body;
  
    try {
      const [results, fields] = await conn.execute('UPDATE `Proyecto.Usuario` SET userpasswd = ? WHERE useremail = ?', [userpasswd1, useremail]);
  

      if (results.affectedRows > 0) {
  
        res.json({ msg: 'Usuario actualizado exitosamente' });
      } else {

        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
  });
  

// DELETE
app.delete('/eliminar', async (req, res) => {
    const { username } = req.query;


    try {
        const [results] = await conn.execute('DELETE FROM `Proyecto.Usuario` WHERE username = ?', [username]);
        console.log('Resultado de la eliminación:', results);

        res.json({ msg: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

