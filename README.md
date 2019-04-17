# FoodCourt

En este documento se explicara como hacer uso del backend realizado para la aplicacion de Android. En algunas de las solicitudes algunas de los parametros dentro de los JSON son opcionales y sera indicado al colocarse. Se dividira en secciones segun los modulos de Usuario y Manejo de restaurantes, la ruta se colocara despues de cada funcion del modulo

La ruta utilizada es la siguiente: [https://foodcourtec.herokuapp.com/](https://foodcourtec.herokuapp.com/)  

Para ningun caso se recibira token de regreso y se debe avisar puesto que el servidor podria estar caido.

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

  *Para los horarios, el array debe tener un tamaño exacto de 7 y cada dia debe tener el formato indicado*  

- Crear Restaurantes: "/createRestaurant"

  Envio:

  {  
    "token" : "Token del usuario,  
    "email" : "Email del usuario",  
    "name" : "Nombre del restaurante",  
    "address" : {"lat" : Punto, "long" : Punto, "direction" : "Descripcion de la ubicacion"},  
    *Opcional* "number" : Numero de telefono,  
    *Opcional* "webPage" : "Pagina Web",  
    *Opcional* "foods" : Array de Comidas,  
    *Opcional* "schedules" : [{day : String, open: Date, close: Date}]  
  }  

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "status" : "Mensaje segun lo sucedido"  
  }

- Actualizar Restaurante: "/updateRestaurant"

  Envio:

  {  
    "token" : "Token del usuario,  
    "email" : "Email del usuario",  
    "id" : "Id del restaurante",  
    *Opcional* "name" : "Nuevo nombre del restaurante",  
    *Opcional* "number" : Numero de telefono,  
    *Opcional* "webPage" : "Pagina Web",  
    *Opcional* "foods" : Array de Comidas,  
    *Opcional* "schedules" : [{day : String, open: Date, close: Date}]  
  }  

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "status" : "Mensaje segun lo sucedido"  
  }

- Crear Opinion: "/createOpinion"

  Envio:

  {  
    "token" : "Token del usuario",  
    "email" : "Email del usuario",  
    "id" : "Id del restaurante",  
    "opinion" : {"calification" : Numero, "price" : Numero, "date" : Fecha, *Opcional* "comment" : "Comentario del usuario"}  
  }  

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "status" : "Mensaje segun lo sucedido"  
  }

- Obtener opiniones: "/getOpinions"  

  Envio:

  {  
    "token" : "Token del usuario",  
    "email" : "Email del usuario",  
    "id" : "Id del restaurante"  
  }  

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "opinions" : Array de opiniones,  
    "status" : "Mensaje segun lo sucedido"  
  }

- Añadir fotos: "/addPhoto"  

  *Recordar que varios archivos se pueden asociar a una llave("photos") simultaneamente, si no el servidor no obtendra las imagenes*  

  Envio:

  {  
    "token" : "Token del usuario",  
    "email" : "Email del usuario",  
    "id" : "Id del restaurante",  
    "photos" : Imagenes del restaurante (Maximo 5)  
  }  

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "status" : "Mensaje segun lo sucedido"  
  }

- Obtener fotos: "/getPhotos"

  Envio:

  {  
    "token" : "Token del usuario",  
    "email" : "Email del usuario",  
    "id" : "Id del restaurante"  
  }  

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "photos" : Array con la informacion binaria de cada foto,  
    "status" : "Mensaje segun lo sucedido"    
  }

- Obtener restaurantes: "/getRestaurants"  

  Envio:

  {  
    "token" : "Token del usuario",  
    "email" : "Email del usuario",  
    "filters" : Json con los Filtros (Se indica el formato mas adelante)  
  }  

  *Json con el formato de filtros*

  {  
    *Opcional* "price" : {"min" : Number, "max" : Number},  
    *Opcional* "calification" : {"min" : Number, "max" : Number},  
    *Opcional* "ubication" : {"lat" : Number, "long" : Number, "distance" : Number},  
    *Opcional* "foods" : Array de comidas permitidas  
  }

  Respuesta:

  {  
    "token" : "Token de respuesta",  
    "restaurants" : Array con restaurantes,  
    "status" : "Mensaje segun lo sucedido"  
  }
