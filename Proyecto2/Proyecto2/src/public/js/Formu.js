
//FUNCIONES PARA MOSTRAR Y OCULTAR FORMULARIOS
window.onbeforeunload = function() 
{
  // Redirige al usuario a la página del formulario después de recargar
  window.location.href = '/index/';
};
function displayFormReg()
 {
   const formIS = document.querySelector("#section-form #formIS");
   const formReg = document.querySelector("#section-form #formReg");
   const formOlv = document.querySelector("#section-form #formOlv");
   
   formOlv.style.display = "none";
   formIS.style.display = "none";
   formReg.style.display="block";
 }

 function displayFormOlv()
 {
    const formIS = document.querySelector("#section-form #formIS");
 
    const formOlv = document.querySelector("#section-form #formOlv");
   
    formOlv.style.display = "block";
    formIS.style.display = "none";
  
  }

 function displayFormIS()
 {
  const formIS = document.querySelector("#section-form #formIS");

  const formOlv = document.querySelector("#section-form #formOlv");
  const formCon = document.querySelector("#section-form #formCon");
  const tabla = document.querySelector("#section-form #tabla");
  let res = document.getElementById("response");
  let btn1 = document.getElementById("btnnn");

  let etiquetas = document.querySelectorAll('form[name="formReg"] label');
  etiquetas.forEach(function (etiqueta) 
  {
    let campo = etiqueta.querySelector('input[required]');
    if (campo) 
    {
      campo.value = '';
   }
  });

  let etiquetas1 = document.querySelectorAll('form[name="formCon"] label');
  etiquetas1.forEach(function (etiqueta) 
  {
    let campo = etiqueta.querySelector('input[required]');
    if (campo) 
    {
      campo.value = '';
    }
    });
  
  let formulariOlv = document.getElementById("formOlv");
  let etiquetaUsername = formulariOlv.querySelector('input[name="user"]');
  //etiquetaUsername.value = " ";
          
   
  formOlv.style.display = "none";
  formReg.style.display="none";
  formIS.style.display = "block"; 
  tabla.style.display = "none"; 
  formCon.style.display = "none";
  res.style.display = "none";
  btn1.style.display = "none";
}

//FUNCION PARA INICIAR SESION 

function Iniciarsesion()
{
      window.location.href = '/users';
        let formularioIS = document.getElementById("formIS");
        let etiquetaUsername = formularioIS.querySelector('input[name="username"]');
        let etiquetaPasswd = formularioIS.querySelector('input[name="passwd"]');
        etiquetaUsername.value = "";
        etiquetaPasswd.value = "";

        let formIS = document.querySelector("#section-form #formIS");
        formIS.style.display = "none";
        let tabla = document.querySelector("#tabla");
        tabla.style.display = "block";
        

} 
function INICIO()
 {
  window.location.href = '/index';
 }

 function CERRAR()
 {
  window.location.href = '/index';
  var cookies = document.cookie.split(";");

    // Iterar sobre las cookies y eliminar la especificada
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var igualPos = cookie.indexOf("=");
        var nombre = igualPos > -1 ? cookie.substr(0, igualPos).trim() : cookie.trim();

        // Verificar si la cookie coincide con el nombre proporcionado
        if (nombre === token) {
            // Establecer la fecha de expiración en el pasado para eliminar la cookie
            document.cookie = token + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
            break;
        }
    }
  alert("Sesion cerrada exitosamente");

 }


 function ADMIN()
 {
  window.location.href = '/admin';
 }

 function OPERATIVO()
 {
  window.location.href = '/Operativo';
 }
 function REGISTRA()
 {
  window.location.href = '/registra';
 }
 function API()
 {
  window.location.href = '/cargar';
 }

  //FUNCION QUE REGISTRA USUARIOS
  function registerUser() 
  {
        //window.location.href = '/registrar';
        
        displayFormIS();
        console.log("Este es un mensaje de prueba.");
  }

  //GESTION DEL CARRITO DE COMPRAS
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // GESTION DEL CARRITO DE COMPRAS
  function addToCart(name, thumbnail) 
  {
      alert("Se agrego: " + name + " exitosamente al carrito");
      
      // Agregar al carrito
      carrito.push({ name: name, thumbnail: thumbnail });
      
      // Guardar el carrito en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));
      
      console.log(carrito);
  }

  function CARRITO()
  {
    alert("Trabajando en ello");
    window.location.href = '/carrito';
  }
  
  function BUSQUEDA()
  {
    alert("Trabajando en ello");
    window.location.href = '/cargar';
  }

  // Obtener carrito desde localStorage
  function obtenerCarrito () {
    const carritoString = localStorage.getItem('carrito');
  
    if (carritoString) {
      const carrito = JSON.parse(carritoString);
      return carrito;
    }
  
    return null;
  };

 // Función para mostrar el carrito en la interfaz de usuario
function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const carritoContainer = document.getElementById('carrito-container');

  if (carrito && carrito.length > 0) {
    carritoContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar elementos

    // Crear un contenedor de fila para organizar las imágenes
    let rowContainer;

    carrito.forEach((item, index) => {
      // Crear elementos HTML para cada item del carrito
      const itemElement = document.createElement('div');
      itemElement.className = 'carrito-item';

      // Agregar la imagen y el botón
      itemElement.innerHTML = `<img src="${item.thumbnail}" alt="${item.name}" class="carrito-img">
                               <p>${item.name}</p>
                               <button onclick="eliminarDelCarrito('${item.name}')">Eliminar del carrito</button>`;

      // Crear una nueva fila después de cada 5 elementos
      if (index % 5 === 0) {
        rowContainer = document.createElement('div');
        rowContainer.className = 'carrito-row';
        carritoContainer.appendChild(rowContainer);
      }

      // Agregar el elemento al contenedor de fila
      rowContainer.appendChild(itemElement);
    });
  } else {
    // Manejar el caso cuando el carrito esté vacío
    carritoContainer.innerHTML = '<p>El carrito está vacío</p>';
  }
}


// Función para eliminar un elemento del carrito

function eliminarDelCarrito(name) {
  let carrito = obtenerCarrito();

  // Encuentra el índice del elemento a eliminar
  const index = carrito.findIndex(item => item.name === name);

  if (index !== -1) {
    // Elimina el elemento del array
    carrito.splice(index, 1);

    // Actualiza el localStorage con el nuevo carrito
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Llama directamente a mostrarCarrito para actualizar la interfaz
    mostrarCarrito();
  }
}
  
  // Enviar datos al servidor
  const enviarDatosAlServidor = async () => {
    const carrito = obtenerCarrito();
  
    if (carrito) {
      
      const url = 'http://localhost:3000/infoc';
      const data = { carrito };
      console.log(data);
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
 
        // Manejar la respuesta del servidor si es necesario
        const responseData = await response.json();
        console.log(responseData);
        alert("Carrito enviado");
        localStorage.clear();
      } catch (error) {
        alert("Problema al enviar carrito");
        localStorage.clear();
        console.log(error);
      }
    }
  };
  
 
//FUNCION QUE NOS PERMITE CAMBIAR AL FORMULARIO PARA CAMBIAR CONTRASEÑA

function Enviar()
{
  let usuario = document.formOlv.user.value;
  uu = document.formOlv.user.value;
  

  if (listaUsuarios.findIndex(user => user.email === usuario)  === -1) 
  {
      alert("Usuario no registrado");
  } 
  else
  {
    for (let i = 0; i < listaUsuarios.length; i++) 
    {
      let objeto = listaUsuarios[i];
      if (objeto.email === usuario && objeto.answer === md5(document.formOlv.response.value)) 
      {
        let formOlv = document.querySelector("#section-form #formOlv");
        formOlv.style.display = "none";
        let formCon = document.querySelector("#section-form #formCon");
        formCon.style.display = "block";
        let res = document.getElementById("response");
          res.style.display = "none";
          let btn1 = document.getElementById("btnnn");
          btn1.style.display = "none";
        let texto = document.getElementById("Nombreus");  
        texto.textContent = ("Usuario: "+objeto.user);

        break;
      } 
     
    }
    if (listaUsuarios.findIndex(user => user.answer === md5(document.formOlv.response.value))  === -1) 
      {
          alert("Respuesta incorrecta, intente de nuevo");
          let formOlv = document.querySelector("#section-form #formOlv");
          formOlv.style.display = "none";
          let formCon = document.querySelector("#section-form #formIS");
          formCon.style.display = "block";
      }

  }

  let formulariOlv = document.getElementById("formOlv");
  let etiquetaUsername = formulariOlv.querySelector('input[name="user"]');
  let etiquetaPasswd = formulariOlv.querySelector('input[name="response"]');
  etiquetaUsername.value = "";
  etiquetaPasswd.value = "";
  let texto = document.getElementById("Preguntas");
  texto.textContent = " ";

}

//FUNCION PARA CREAR NUEVA CONTRASEÑA

function Nuevacont()
{
  
    for (let i = 0; i < listaUsuarios.length; i++) 
    {
      
        let etiquetas = document.querySelectorAll('form[name="formCon"] label');
        etiquetas.forEach(function (etiqueta) 
        {
        let campo = etiqueta.querySelector('input[required]');
        if (campo) 
        {
            campo.value = '';
        }
        });

        let formCon = document.querySelector("#section-form #formCon");
        formCon.style.display = "none";
        let formIs = document.querySelector("#section-form #formIS");
        formIs.style.display = "block";
          break;
    } 
    
  }




