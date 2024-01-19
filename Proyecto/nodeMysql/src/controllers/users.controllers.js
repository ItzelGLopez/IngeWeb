import * as userService from '../services/users.service.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

const secretKey = 'IEJE3180113';
const carrito = []; // Almacena los personajes en el carrito

export const showCatalogo = async (req, res) => {
  try {
    const charname = req.query.charname;
    const catalogo = await userService.getCatalogo(charname);
    res.render('catalogo', { title: 'Catálogo de Personajes', catalogo });
  } catch (error) {
    res.render('error404', { title: 'Error', descripcion: 'Error al obtener datos del catálogo' });
  }
};

// Función para generar un token
function generarToken(email)
{
    const payload = {email};
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}

// Función para verificar un token
function verificarToken(token) 
{
    try {
        const decoded = jwt.verify(token, secretKey);
        //console.log(decoded.email);
        return decoded.email;
    } catch (error) 
    {
        console.error('Error al verificar el token:', error);
        throw error;
    }
}


export const Tokenauth = async (req, res, next) => {
   const token = req.cookies.token;
   console.log('cookies:', req.cookies);
 
   if (!token) {
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "No se proporcionó un token.",
     });
   }
 
   try {
     const correo = verificarToken(token);
     req.email = correo;
     const userData = await userService.getUserByEmail(correo);
     req.userId = userData.id;
     next();
   } catch (error) {
     console.error("Error al verificar el token:", error);
     return res.status(401).json({ error: 'Token inválido' });

   }
 };

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render("users", { "title": "Lista de usuarios registrados", "list": users });
    } catch (error) {
        console.error(error);
        res.status(500).render("error404", { titulo: "Error al obtener usuarios", descripcion: "Error en el servidor" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = userService.hashPassword(password);
    try {
        let auth = await userService.valAuth(email, password);
        console.log(auth);
        if (auth.password == hashedPassword) {
            // Autenticación exitosa
            if (auth.role == 'admin'){
                const token = generarToken(email);
                res.cookie('token', token, { httpOnly: true });
                res.redirect("/users");
            }else{
                const token = generarToken(email);
                res.cookie('token', token, { httpOnly: true });
                res.redirect("/catalogo");
            }
        } else {
            // Manejar el caso de autenticación fallida
            res.render("error404", { titulo: "Error de autenticación", descripcion: "Credenciales inválidas" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render("error404", { titulo: "Error de autenticación", descripcion: "Error en el servidor" });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, password, secQuestion, secAnswer, role, confirmPassword } = req.body;

    try {
        const result = await userService.register(name, email, password, secQuestion, secAnswer, role, confirmPassword);

        if (result) {
            // Registro exitoso, redirige a la vista de usuarios o a donde sea necesario
            res.redirect("/");
        } else {
            // Manejar el caso de registro fallido
            res.render("error404", { titulo: "Error de registro", descripcion: result.msg || "Error al registrar usuario" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render("error404", { titulo: "Error de registro", descripcion: "Error en el servidor" });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        if (userId) {
            await userService.deleteU(userId);
            res.redirect("/users");
        } else {
            res.render("error404", {titulo: "Error al borrar usuario", descripcion: "ID de usuario no proporcionado"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).render("error404", { titulo: "Error al eliminar usuario", descripcion: "Error en el servidor" });
    }
};

export const updateUByAdmin = async (req, res) => {
    const { email } = req.body;
    //console.log(email);
    try {
        if (email) {
            const userData = await userService.getUserByEmail(email);
            res.render('recover-password-admin', { title: 'Cambiar Contraseña', id: userData.id, name: userData.name, email: userData.email, password: userData.password, secquestion: userData.secquestion, secanswer: userData.secanswer, role: userData.role });
        } else {
            res.render("error404", {titulo: "Error al borrar usuario", descripcion: "ID de usuario no proporcionado"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).render("error404", { titulo: "Error al eliminar usuario", descripcion: "Error en el servidor" });
    }
};


export const recoverPassword = (req, res) => {
   res.render("recover-password", {titulo: "Recuperar Contraseña"});
};

export const updatePassword = async (req, res) => {
    const {email, secAnswer} = req.body;
    const hashedAnswer = userService.hashPassword(secAnswer);
    const config = { //especificamos los objetos que necesita nuestra libreria 
        host: 'smtp.gmail.com',
        port: 587,
        auth: {//autorizador = solicitara el usuario de la cuenta de correo y la contaseña
            user: 'iwpru3b4@gmail.com', //iwpru3b4@gmail.com
            pass: 'cved tzul hcct pnuj '//cved tzul hcct pnuj 
        }

    }

    if (email) {
        try {
            // Obtén la pregunta de seguridad del usuario
            const user = await userService.getUserByEmail(email);
            //console.log(user);
            //console.log(user.secanswer);
            //console.log(hashedAnswer);
            if (user && user.secanswer === hashedAnswer) {
                const newPassword = userService.generateRandomPassword();
                await userService.updatePassword(email, newPassword);
                const mailOptions = {
                    from: "garces.flores.fernando@gmail.com",
                    to: email,
                    subject: "Recuperación de Contraseña",
                    text: `Tu contraseña es: ${newPassword}`,
                };
                const transport = nodemailer.createTransport(config);
                await transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo:", error);
                        res.render("error404", { title: "Error", descripcion: "Error al enviar el correo" });
                    } else {
                        console.log("Correo enviado: " + info.response);
                        res.redirect("/");
                    }
                });
            } else {
                res.render("error404", { title: "Error", descripcion: "Pregunta de seguridad incorrecta" });
            }
        } catch (error) {
            console.error("Error al procesar la recuperación de contraseña:", error);
            res.render("error404", { title: "Error", descripcion: "Error al procesar la recuperación de contraseña" });
        }
    } else {
        res.render("error404", {titulo: "Error al cambiar contraseña", descripcion: "Correo y nueva contraseña son obligatorios"});
    } 
 };

 export const updatePasswordByAdmin = async (req, res) => {
    const {email, newPassword} = req.body;
    console.log(email);
    if (email) {
        try {
            await userService.updatePassword(email, newPassword);
            console.log(newPassword);
            res.redirect("/users");
        } catch (error) {
            console.error(error);
            res.render("error404", {titulo: "Error al cambiar contraseña", descripcion: "Error al actualizar la contraseña"});
        }
    } else {
        res.render("error404", {titulo: "Error al cambiar contraseña", descripcion: "Correo y nueva contraseña son obligatorios"});
    } 
 };

 export const updateUserDataByAdmin = async (req, res) => {
    const {id, email, newPassword, name, secquestion, secanswer, role} = req.body;
    const hashedPassword = userService.hashPassword(newPassword);
    console.log(email);
    if (email) {
        try {
            await userService.updateUserDataByAdmin(id, name, email, hashedPassword, secquestion, secanswer, role);
            console.log(newPassword);
            res.redirect("/users");
        } catch (error) {
            console.error(error);
            res.render("error404", {titulo: "Error al cambiar datos de usuario", descripcion: "Error al actualizar el usuario"});
        }
    } else {
        res.render("error404", {titulo: "Error al cambiar datos de usuario", descripcion: "datos de usuario son obligatorios"});
    } 
 };


// Controlador para mostrar el carrito
export const mostrarCarrito = async (req, res) => {
    Tokenauth(req, res, async () => {
        const token = req.cookies.token;
        const correo = verificarToken(token);
        req.email = correo;
        const userData = await userService.getUserByEmail(correo);
        const carrito = await userService.obtenerPersonajesCarrito(userData.id);
        res.render('carrito', { title: 'Carrito de Compras', carrito });
    });
};

// Controlador para agregar al carrito
/*export const agregarpersonajeAlCarrito = async (req, res) => {
    const { name, thumbnail } = req.body;
    const token = req.cookies.token;
    const correo = verificarToken(token);
    req.email = correo;
    const userData = await userService.getUserByEmail(correo);
    console.log(userData.id);
    try{
    userService.agregarPersonajeAlCarrito(userData.id, name, thumbnail);
    res.redirect('/catalogo');
    }catch(error){
        console.error(error);
        res.render("error404", {titulo: "Error al agregar personajes", descripcion: "Error al insertar en el carrito"});
    }
};*/

export const logout = (req, res) => {
    // Elimina la cookie que contiene el token
    res.clearCookie('token');
  
    // Redirecciona a la página de inicio u otra página deseada
    res.redirect('/');
};
  
export const agregarpersonajeAlCarrito = async (req, res) => {
    try {
        // Utiliza Tokenauth para verificar el token antes de procesar la compra
        Tokenauth(req, res, async () => {
            const { name, thumbnail, precio } = req.body;
            const token = req.cookies.token;
            const correo = verificarToken(token);
            req.email = correo;
            const userData = await userService.getUserByEmail(correo);
            console.log(name, thumbnail, precio );
            // Continúa con la lógica de agregar al carrito si el token es válido
            userService.agregarPersonajeAlCarrito(userData.id, name, thumbnail, precio);
            res.redirect('/catalogo');
        });
    } catch (error) {
        console.error(error);
        res.render("error404", {titulo: "Error al agregar personajes", descripcion: "Error al insertar en el carrito"});
    }
};

export const borrarPersonajesDelCarrito = async (req, res) => {
    try {
        // Utiliza Tokenauth para verificar el token antes de borrar los personajes del carrito
        Tokenauth(req, res, async () => {
            const { nombre_personaje, imagen_personaje } = req.body;
            console.log(nombre_personaje);
            const token = req.cookies.token;
            const correo = verificarToken(token);
            req.email = correo;
            const userData = await userService.getUserByEmail(correo);

            // Continúa con la lógica de borrar personajes del carrito si el token es válido
            await userService.borrarPersonajeAlCarrito(userData.id,nombre_personaje,imagen_personaje);
            res.redirect('/carrito');
        });
    } catch (error) {
        console.error(error);
        res.render("error404", {titulo: "Error al borrar personajes del carrito", descripcion: "Error al borrar personajes del carrito"});
    }
};

export const mostrarFormularioPago = (req, res) => {
    // Renderiza la vista del formulario de pago
    res.render('checkout', { titulo: 'Información de Pago' });
};

export const addPaymentMethod = async (req, res) => {
    const {calle, colonia, codigo_postal, municipio_delegacion, estado, telefono, num_tarjeta, fecha_expiracion, cvv} = req.body;
    const token = req.cookies.token;
            const correo = verificarToken(token);
            req.email = correo;
            const userData = await userService.getUserByEmail(correo);
        try {
            await userService.addPaymentMethod(calle, colonia, codigo_postal, municipio_delegacion, estado, telefono, num_tarjeta, fecha_expiracion, cvv, userData.id);
            res.render("exito", {titulo: "Pago finalizado", descripcion: "Su pago ha sido concretado"});
        } catch (error) {
            console.error(error);
            res.render("error404", {titulo: "Error al cambiar datos de usuario", descripcion: "Error al actualizar el usuario"});
        }
 };
