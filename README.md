# FoodCourt

En este documento se explicara como hacer uso del backend realizado para la aplicacion de Android. En algunas de las solicitudes algunas de los parametros dentro de los JSON son opcionales y sera indicado al colocarse. Se dividira en secciones segun los modulos de Usuario y Manejo de restaurantes, la ruta se colocara despues de cada funcion del modulo

La ruta utilizada es la siguiente: [https://foodcourtec.herokuapp.com/](https://foodcourtec.herokuapp.com/)  

*Nota*

En caso de que el servidor falle y no sea problema directa de la solicitud realizada, recibira un JSON con el siguiente formato:

{
  "error" : "Mensaje de error"
}

Para esto, no se recibira token de regreso y se debe avisar puesto que el servidor podria estar caido

## Usuarios  

- Registro de Usuario: "/createUser"

  Envio:

  {
    "email" : "Email del usuario",
    "name" : "Nombre del usuario",
    "password" : "Password del usuario"
  }  
  
  Respuesta:
  
  {
    "status" : "Mensaje segun lo sucedido"
  }
  
- Inicio de Sesion: "/loginUser"

  Envio:

  {
    "email" : "Email del usuario",
    "password" : "Password del usuario",
    "socialLogin" : Boolean si el usuario ingresa con Faceboook
  }  
  
  En este caso, si se inicia sesion con Facebook, la key "password" no es necesaria, igual en caso contrario
  
  Respuesta:
  
  {
    "token" : "Token para proximas solicitudes",
    "name" : "Nombre del usuario",
    "photo" : Informacion binaria de la foto,
    "contentType" : "Formato de la foto"
  }
  
  Si el inicio de sesion es por Facebook se recibira unicamente el Token como respuesta
  
- Obtener codigo: "/requestCode"

  Envio:

  {
    "email" : "Email del usuario"
  }  
  
  Respuesta:
  
  { 
    "status" : "Mensaje segun lo sucedido"
  }
  
  Recordar que se envia un correo al email brindado con el codigo para cambiar la contraseña
  
- Recuperar contraseña: "/resetPassword"

  Envio:

  {
    "email" : "Email del usuario",
    "password" : "Password nueva",
    "code" " "Codigo enviado al correo"
  }  
  
  Respuesta:
  
  {
    "status" : "Mensaje segun lo sucedido"
  }
  
- Actualizar Nombre: "/updateName"

  Envio:

  {
    "email" : "Email del usuario",
    "token" : "Token obtenido en el inicio de sesion u otras solicitudes",
    "name" : "Nuevo nombre del usuario"
  }  
  
  Respuesta:
  
  {
    "token" : "Token de respuesta",
    "status" : "Mensaje segun lo sucedido"
  }
  
- Actualizar Foto: "/updatePhoto"

  Envio:

  {
    "token" : "Token del usuario",
    "email" : "Email del usuario",
    "contentType" : "Formato de la imagen",
    "avatar" : Imagen a colocar
  }  
  
  Respuesta:
  
  {
    "token" : "Nuevo token",
    "status" : "Mensaje segun lo sucedido"
  }
  
## Comidas

- Obtener comidas: "/getFoods"

  Envio:

  {
    "token" : "Token del usuario",
    "email" : "Email del usuario"
  }  
  
  Respuesta:
  
  {
    "token" : "Token de respuesta",
    "foods" : Comidas
  }
  
## Restaurantes

- Crear Restaurantes:  

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
  
- Actualizar Restaurante:  

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
  
- Crear Opinion:  

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
  
- Obtener opiniones:  

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
  
- Añadir fotos:  

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
  
- Obtener fotos:

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
  
- Obtener restaurantes:  

  Envio:

  {
  
  }  
  
  Respuesta:
  
  {
  
  }
