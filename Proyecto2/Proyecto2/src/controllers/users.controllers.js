import * as userService from '../services/users.service.js';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

const secretKey = 'IEJE3180113';

// Función para generar un token
function generarToken(username,userposition)
{
    const payload = { usuario: username,position:userposition };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}
// Función para generar un token correo
function generarTokenc(useremail)
{
    const payload = { email: useremail};
    const token = jwt.sign(payload, secretKey, { expiresIn: '10m' });
    return token;
}

// Función para verificar un token
function verificarToken(token) 
{
    try {
        const decoded = jwt.verify(token, secretKey);
         console.log( decoded.usuario, decoded.position );
        return { usuario: decoded.usuario, userposition: decoded.position };
    } catch (error) 
    {
        console.error('Error al verificar el token:', error);
        throw error;
    }
}

//CONTROLADOR PARA AUTENTICAR TOKEN
export const Tokenauth = (req, res, next) => {
   const token = req.cookies.token;
   console.log('Cookies:', req.cookies);
 
   if (!token) {
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "No se proporcionó un token.",
     });
   }
 
   try {
     const usuarioVerificado = verificarToken(token);
     req.user = usuarioVerificado;
     console.log(usuarioVerificado.userposition);
     if(usuarioVerificado.userposition === 1)
     next();
   else
   {
      return res.render("error404", {
         title: "ERROR DE AUTENTICACIÓN",
         descripcion: "NO tiene acceso esta pagina.",
       });
   }
   } catch (error) {
     console.error("Error al verificar el token:", error);
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "Token inválido.",
     });
   }
 };

 
//CONTROLADOR PARA AUTENTICAR TOKEN
export const Tokenautho = (req, res, next) => {
   const token = req.cookies.token;
   console.log('Cookies:', req.cookies);
 
   if (!token) {
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "No se proporcionó un token.",
     });
   }
 
   try {
     const usuarioVerificado = verificarToken(token);
     req.user = usuarioVerificado;
     next();
     
   } catch (error) {
     console.error("Error al verificar el token:", error);
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "Token inválido.",
     });
   }
 };

 //CONTROLADOR AUTENTICAR TOKEN DE CAMBIO CONTRASEÑA
 export const Tokenauthc = (req, res, next) => {
   const token = req.cookies.token;
   console.log('Cookies:', req.cookies);
 
   if (!token) {
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "No se proporcionó un token.",
     });
   }
 
   try {
     const usuarioVerificado = verificarToken(token);
     req.user = usuarioVerificado;
     next();
   } catch (error) {
     console.error("Error al verificar el token:", error);
     return res.render("error404", {
       title: "ERROR DE AUTENTICACIÓN",
       descripcion: "Token inválido.",
     });
   }
 };
 
//CONTROLADOR PARA OBTENER TODOS LOS USUARIOS
export const getAllUsers = async (req, res) => {
   try {
       // Utiliza await para esperar a que la promesa se resuelva
       const users = await userService.getAllUsers();

       // Verifica si la respuesta es un array antes de intentar renderizar
       if (Array.isArray(users)) {
           // Continúa con el resto de tu código para renderizar la vista
           res.render("users", {
               title: "Lista de usuarios registrados",
               list: users,
           });
       } else {
           // Si la respuesta no es un array, maneja el error
           console.error('La respuesta de la API externa no es un array:', users);
           return res.render("error404", {
               title: "ERROR DE CONEXIÓN",
               descripcion: "Error al obtener usuarios desde la API externa",
           });
       }
   } catch (error) {
       // Manejo de errores
       // Envía una respuesta de error al cliente, si es necesario
       console.error('Error al obtener usuarios:', error);
       return res.render("error404", {
           title: "ERROR DE CONEXIÓN",
           descripcion: "Error al obtener usuarios",
       });
   }
};

//CONTROLADOR PARA INICIAR SESION
export const login = async (req, res) => {
   let tokenGenerado;
  try {
    const { username, userpasswd } = req.body;

    if (!username || !userpasswd) {
      return res.render("error404", {
         title: "ERROR AL VALIDAR",
         descripcion:("Datos incompletos" )
      });    }

    let auth = await userService.valAuth(username, userpasswd);
   
    if (auth && auth.userposition == 1) {

      const users = await userService.getAllUsers();
      tokenGenerado = generarToken(auth.username,auth.userposition);
      res.cookie('token', tokenGenerado, { httpOnly: true,secure:true });

      return res.render("decision", {
        title: "Elija la forma en la que desea acceder",
        user: auth,
      });
    }
    if (auth && auth.userposition == 0) {
      tokenGenerado = generarToken(auth.username,auth.userposition);
      res.cookie('token', tokenGenerado, { httpOnly: true,secure:true });

      return res.render("personajes", {
        title: "Vista operador",
        
      });
    }

    return res.render("error404", {
      title: "ERROR AL VALIDAR",
      descripcion:("Contraseña o nombre de usuario invalido" )
   });
  } catch (error) {
 
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

//CONTROLADOR PARA REGISTRAR USUARIOS
export const registrarUsuario = async (req, res) => {
   
   const { username, useremail, userpasswd, userquestion, useranswer, userposition,cpasswd } = req.body;

   try {
      // Utiliza await para esperar a que la promesa se resuelva
      
      const result = await userService.registerrUsuario(username, useremail, userpasswd, userquestion, useranswer, userposition,cpasswd);

      if (result) {
         // Envía una respuesta de éxito al cliente si es necesario
         res.render("exito", {
            title: "REGISTRO EXITOSO",
            descripcion:("Usuario registrado con exito" )
         });
      } else {
         // Envía una respuesta de error al cliente si es necesario
         res.render("error404", {
            title: "ERROR AL REGISTRAR",
            descripcion:("Error al registrar los usuarios" )
         });
      }
   } catch (error) {
      // Envía una respuesta de error al cliente, si es necesario
      res.render("error404", {
         title: "ERROR AL REGISTRAR",
         descripcion:( "Error al registrar los usuarios (Escoja otro nombre de usuario)")
      });
   }
}

//CONTROLADOR PARA ELIMINAR USUARIO
export const borrauser = async (req, res) => {
   const { username } = req.query;
   try {

       const users = await userService.eliminar(username);
       const users2 = await userService.getAllUsers();
   res.render("users", {
      title: "Lista de usuarios registrados",
      list: users2
   });

   } catch (error) {
       // Manejo de errores
       // Envía una respuesta de error al cliente, si es necesario
       console.error('Error al borrar usuarios:', error);
   }
};


//VISTAS
export const index = async (req, res) => {
   res.render("index")
};
export const Operativo = async (req, res) => {
   res.render("personajes")
};

export const registra = async (req, res) => {
   res.render("registra")
};
export const carrito = async (req, res) => {
   res.render("carro")
};

//CONTROLADOR QUE MUESTRA LISTA DE USUARIOS
export const admin = async (req, res) => {
   const users = await userService.getAllUsers();
   res.render("users", {
      title: "Lista de usuarios registrados",
      list: users
   });
  
};

//CONTROLADOR API MARVEL
export const cargar = async(req,res)=>{
   try {
      const charname = req.query.charname;
      const marvelData = await userService.marvel(charname);
      console.log(charname);
      console.log(marvelData);
      res.render("personajes", {
         title: "Personajes marvel",
         list: marvelData
      });
    } catch (error) {
      res.render("error404", {
         title: "ERROR AL OBTENER DATOS",
         descripcion:( "Error al obtener datos")
      });
   }
}


export const info = async (req, res) => {
   try {
     const carrito = req.body.carrito;
     const token = req.cookies.token;
     console.log('Cookies:', req.cookies);
 
     try {
       const decoded = jwt.verify(token, secretKey);
     
       const username = decoded.usuario;
 
       const proceso = await userService.guardarEnBaseDeDatos(username, carrito);
 
       res.status(200).json({ mensaje: 'Datos del carrito recibidos con éxito' });
     } catch (error) {
         res.render("error404", {
         title: "ERROR AL OBTENER DATOS",
         descripcion:( "Error al validar token")
      });
     }
   } catch (error) {
      res.render("error404", {
         title: "ERROR CON CARRITO",
         descripcion:( "Error al enviar datos del carrito")
      });
   }
 };
 
 //CONTROLADOR CAMBIO DE CONTRASEÑA
 export const correos = async (req, res) => {
   const useremail = req.body.useremail;
   let tokenGeneradoc;

   try {
      const proceso = await userService.buscac(useremail);

      if (proceso) {
         // Generar y asignar el token a una cookie
         tokenGeneradoc = generarTokenc(useremail);
         res.cookie('token', tokenGeneradoc, { httpOnly: true, secure: true });

         // Enviar una respuesta JSON al cliente indicando éxito
         res.render("validacion", {
            title: "Olvide contraseña",
            username: proceso.username,
            userquestion: proceso.userquestion,
         });
      } else {
         // Enviar una respuesta JSON indicando que el usuario no se encontró
         res.status(404).json({
            error: 'Usuario no encontrado',
            description: 'No se encontró el usuario',
         });
      }
   } catch (error) {
      // Manejar otros tipos de errores
      console.error(error);
      res.status(500).json({
         error: 'Error buscando usuario',
         description: 'Error interno del servidor',
      });
   }
};
//CONTROLADOR PARA MODIFICAR CONTRASEÑA Y ENVIAR CORREO
export const cambia = async (req, res) => {
   
   const token = req.cookies.token;
   const useranswer = req.body.useranswer;
   let useranswer1 = createHash("md5").update(useranswer).digest("hex");
   const decoded = jwt.verify(token, secretKey);
   const useremail = decoded.email;
   const proceso = await userService.buscac(useremail);
   if (proceso.useranswer === useranswer1)
   {
   try {

      try {
        const link = `http://localhost:3000/restablecer-contrasena/${token}`
        
        const proceso = await userService.correo(useremail,link);
        res.clearCookie('token');

        res.render("exito", {
         title: "CORREO EXITOSO",
         descripcion:("Correo enviado con exito" )
      });
      } catch (error) {
          res.render("error404", {
          title: "ERROR AL OBTENER DATOS",
          descripcion:( "Error al validar token")
       });
      }
    } 
    catch (error) {
       res.render("error404", {
          title: "ERROR ",
          descripcion:( "Error con correo")
       });
    }
   }
   else
   {
      res.render("error404", {
         title: "ERROR  ",
         descripcion:( "Respuesta incorrecta")
      });
   }
};

export const contra = async (req, res) => {
   try {
      const token = req.params.token;
      // Establece la cookie antes de enviar cualquier otra respuesta al cliente
      res.cookie('token', token, { httpOnly: true, secure: true });
      
      const decoded = jwt.verify(token, secretKey);
      const useremail = decoded.email;
  
      res.render("cambio", {
         title: "CAMBIE SU CONTRASEÑA"
      });
   } catch (error) {
      res.render("error404", {
         title: "TOKEN INVALIDO",
         descripcion: "Token expirado o invalido"
      });
      console.log(error);
   }
};


export const modificac = async(req,res)=>{

   let result;
   try {

      const token = req.cookies.token;
      const { cpsswd, userpasswd } = req.body
  
      const decoded = jwt.verify(token, secretKey);
      const useremail = decoded.email;
     
      result = await userService.cambioc(useremail,userpasswd,cpsswd);

      if(result)
      {
      res.render("exito", {
         titulo: "CAMBIO EXITOSO",
         descripcion:("Contraseña cambiada con exito" )
      });
   }
      else
      {
         res.render("error404", {
            title: "ERROR",
            descripcion:( "Error en el cambio de contraseña")
         }); 
      }
    } catch (error) {
      if (!result)
      {
      res.render("error404", {
         title: "ERROR",
         descripcion:( "Error con contraseña")
      });}
      else
      {
      res.render("error404", {
         title: "TOKEN INVALIDO",
         descripcion:( "Token invalido o expirado")
      });}
      console.log(error);
    }
}