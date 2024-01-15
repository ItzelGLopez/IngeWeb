//import * as userModel from '../models/users.model.js';
import { conn } from '../../db.js';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import {transporter} from '../../nodemailer.js';

const externalApiUrl = 'http://localhost:2000/';
let APImarvel= 'https://gateway.marvel.com/v1/public/characters?nameStartsWith=cap&ts=1&apikey=d6a6422e8d251d428b8f90d5111c1a9e&hash=6b4f0cb5ba7847cf83a2631c7cbcaddd';



export const marvel = async(charname)=>{
  try {
    APImarvel = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${charname}&ts=1&apikey=d6a6422e8d251d428b8f90d5111c1a9e&hash=6b4f0cb5ba7847cf83a2631c7cbcaddd`;
    const response = await fetch(APImarvel);
    if (!response.ok) {
      throw new Error('Error al obtener datos de Marvel API');
    }

    const json = await response.json();
    const characters = json.data.results.map(hero => ({
      name: hero.name,
      thumbnail: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
      url: hero.urls[0].url,
    }));

    return characters;
  } catch (error) {
    console.error('Error en la solicitud a Marvel API:', error);
    throw error;
  }
};

export const valAuth = async(username, userpasswd) =>{

    let hash = createHash("md5").update(userpasswd).digest("hex");
    
    const response = await fetch(`${externalApiUrl}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, hash}),
    });

    const result = await response.json();
    return result;
}


export const getAllUsers = async () => {
  try {
      const response = await fetch(`${externalApiUrl}users`);
 
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();

      const users = JSON.parse(text);

      if (Array.isArray(users)) {
          return users.map((user) => ({
              id: user.username,
              name: user.username,
              email: user.useremail,
          }));
      } else {
          console.error('La respuesta de la API externa no es un array:', users);
          throw new Error('Error en el formato de la respuesta de la API externa');
      }
  } catch (error) {
      console.error('Error al realizar la solicitud HTTP:', error);
      throw error;
  }
};

export const registerrUsuario = async (username, useremail, userpasswd, userquestion, useranswer, userposition, cpasswd) => {
  const userpasswd1 = createHash("md5").update(userpasswd).digest("hex");
  const cpasswd1 = createHash("md5").update(cpasswd).digest("hex");

  if (userpasswd1 === cpasswd1) {
      try {
          const response = await fetch(`${externalApiUrl}registro`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username,
                  useremail,
                  userpasswd1,
                  userquestion,
                  useranswer,
                  userposition,
              }),
          });

          if (!response.ok) {
              throw new Error(`Error en la solicitud: ${response.statusText}`);
          }

          const result = await response.json();
          return result;
      } catch (error) {
          console.error('Error en la solicitud:', error.message);
          throw error;
      }
  } else {
      throw new Error('Las contraseñas no coinciden');
  }
};

export const eliminar = async (username) => {
  const response = await fetch(`${externalApiUrl}eliminar?username=${username}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  const result = await response.json();
  return result;
}

export const guardarEnBaseDeDatos = async (username, carrito) =>{

  const nombres = carrito.map(producto => producto.name);
  const thumbnails = carrito.map(producto => producto.thumbnail);
  const size = carrito.length;
  console.log(size);

  const response = await fetch(`${externalApiUrl}carrito`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, nombres,thumbnails,size}),
});

const result = await response.json();
return result;
}

export const buscac = async (useremail) => {
  try {
     const response = await fetch(`${externalApiUrl}usuarioc`, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useremail }),
     });

     if (!response.ok) {
        // Manejar el caso en que la respuesta no sea exitosa
        throw new Error('Error en la solicitud del servicio');
     }

     const data = await response.json();

     // Devolver los datos necesarios

     return {
        username: data[0].username,
        userquestion: data[0].userquestion,
        useranswer: data[0].useranswer,
     };
  } catch (error) {
     // Manejar errores o lanzarlos nuevamente
     throw error;
  }
};


export const correo = async(useremail,link) =>{
  
  const mailOptions = {
    from: 'pingeweb50@gmail.com',
    to: useremail,
    subject: 'Cambio contraseña',
    text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${link}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
}

export const cambioc = async (useremail, userpasswd, cpsswd) => {
  try {
    const userpasswd1 = createHash("md5").update(userpasswd).digest("hex");
    const cpasswd1 = createHash("md5").update(cpsswd).digest("hex");

    if (userpasswd1 !== cpasswd1) {
      throw new Error("Las contraseñas no coinciden");
    }

    const response = await fetch(`${externalApiUrl}cambiarc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ useremail, userpasswd1 }),
    });

    if (!response.ok) {
      throw new Error(`Error en la llamada a la API: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error(error.message);
    throw new Error('Error en el servicio de cambio de contraseña');
  }
};