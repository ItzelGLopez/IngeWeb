//index.js
import express from 'express';
import { conn } from '../db.js';
import { createHash } from 'crypto';
import { log } from 'console';

const app = express();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// POST
app.post('/register', async (req, res) => {
    const { name, email, password, secQuestion, secAnswer, role } = req.body;
    console.log(password);
    console.log(secAnswer);

    try {
        const [results] = await conn.execute('INSERT INTO Proyecto.usuarios (name, email, password, secquestion, secanswer, role) VALUES (?, ?, ?,?,?,?)', [name, email, password, secQuestion, secAnswer, role]);

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
    const { email, password } = req.body;
    try {
        const [results] = await conn.execute('SELECT * FROM Proyecto.Usuarios WHERE email = ?', [email]);
        console.log(results);
        console.log(password);
        if (results && results.length > 0) {

            if (results[0].password === password) {
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

app.post('/userbyemail', async (req, res) => {
    const { email } = req.body;
    try {
        const [results] = await conn.execute('SELECT * FROM Proyecto.Usuarios WHERE email = ?', [email]);
        console.log(results);
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// GET
app.get('/users', async (req, res) => {
    try {
        const [rows] = await conn.query('SELECT * FROM Proyecto.Usuarios');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});


// PUT
app.put('/update', async (req, res) => {
    const { password, email } = req.body;
    try {
        const [results] = await conn.query('UPDATE Proyecto.Usuarios SET password = ? WHERE email = ?', [password, email]);
        console.log('Resultado de la actualizacion:', results);
        res.json({ msg: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario usuario:', error);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

app.put('/update-user', async (req, res) => {
    const { id, name, email, password, secQuestion, secAnswer, role } = req.body;

    try {
        const [results] = await conn.query(
            'UPDATE Proyecto.Usuarios SET name=?, email=?, password=?, secquestion=?, secanswer=?, role=? WHERE id=?',
            [name, email, password, secQuestion, secAnswer, role, id]
        );

        console.log('Resultado de la actualización:', results);
        res.json({ msg: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario usuario:', error);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});


// DELETE
app.delete('/delete', async (req, res) => {
    const { userId } = req.body;


    try {
        const [results] = await conn.execute('DELETE FROM Proyecto.Usuarios WHERE id = ?', [userId]);
        console.log('Resultado de la eliminación:', results);

        res.json({ msg: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
});


// Función para agregar un personaje al carrito en la base de datos
app.post('/agregarPersonajeAlCarrito', async (req, res) => {
    const { usuarioId, nombrePersonaje, imagenPersonaje, precio } = req.body;

    try {
        const [carrito] = await conn.query('SELECT id FROM Proyecto.Carritos WHERE usuario_id = ?', [usuarioId]);

        // Crear el carrito si no existe
        if (carrito.length === 0) {
            await conn.query('INSERT INTO Carritos (usuario_id) VALUES (?)', [usuarioId]);
        }

        // Obtener el carrito del usuario (ahora debe existir)
        const [carritoActualizado] = await conn.query('SELECT id FROM Proyecto.Carritos WHERE usuario_id = ?', [usuarioId]);

        // Agregar el personaje al carrito con precio
        await conn.query('INSERT INTO Proyecto.PersonajesCarrito (carrito_id, precio, nombre_personaje, imagen_personaje) VALUES (?, ?, ?, ?)', [carritoActualizado[0].id, precio, nombrePersonaje, imagenPersonaje]);

        res.json({ msg: 'Personaje agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ msg: 'Error' });
    }
});
// Función para borrar un personaje al carrito en la base de datos

app.delete('/borrarCarrito', async (req, res) => {
    const { usuarioId, nombrePersonaje } = req.body;
    console.log(nombrePersonaje);

    try {
        // Obtener el ID del carrito del usuario
        const [carrito] = await conn.query('SELECT id FROM Proyecto.Carritos WHERE usuario_id = ?', [usuarioId]);

        // Verificar si el usuario tiene un carrito
        if (carrito.length > 0) {
            const carritoId = carrito[0].id;

            // Borrar todos los personajes del carrito
            await conn.execute('DELETE FROM Proyecto.PersonajesCarrito WHERE nombre_personaje = ?', [nombrePersonaje]);

            res.json({ msg: 'Carrito eliminado exitosamente' });
        } else {
            res.status(404).json({ msg: 'El usuario no tiene un carrito asociado' });
        }
    } catch (error) {
        console.error('Error al eliminar carrito:', error);
        res.status(500).json({ msg: 'Error al eliminar carrito' });
    }
});

// Función para obtener los personajes del carrito desde la base de datos
app.post('/obtenerPersonajesCarrito', async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
    try {
        const [result] = await conn.query(
            'SELECT nombre_personaje, imagen_personaje, precio FROM Proyecto.PersonajesCarrito WHERE carrito_id IN (SELECT id FROM Proyecto.Carritos WHERE usuario_id = ?)',
            [userId]
        );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

app.put('/pago', async (req, res) => {
    const { calle, colonia, codigo_postal, municipio_delegacion, estado, telefono, num_tarjeta, fecha_expiracion, cvv, id} = req.body;

    try {
        const [results] = await conn.query('UPDATE Proyecto.Usuarios SET calle=?, colonia=?, codigo_postal=?, municipio_delgacion=?, estado=?, telefono=?, num_tarjeta=?, fecha_expiracion=?, cvv=? WHERE id=?', [calle, colonia, codigo_postal, municipio_delegacion, estado, telefono, num_tarjeta, fecha_expiracion, cvv, id]);

        console.log('Resultado de la inserción:', results);

        res.json(results);
    } catch (error) {
        console.error('Error al insertar usuario:', error);

    }
});

