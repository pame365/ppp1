# Encontrémonos — web de personas desaparecidas

Plantilla editable en HTML, CSS y JavaScript puro, sin frameworks ni código heredado. Incluye:
- Inicio con espacio visual para portada y tarjetas de casos de ejemplo.
- Menú que cambia de panel dentro de la misma ventana.
- Secciones Nosotros, Servicios, Foro, Iniciar tu proceso y Contactos.
- Búsqueda de fichas de ejemplo.
- Formulario de reporte con campos y vista previa local de fotografía.
- Foro de demostración con mensajes marcados como pendientes de revisión.
- Enlaces externos a sitios institucionales.
- Acceso flotante a WhatsApp configurable.
- Diseño adaptable a celular, tableta y escritorio.

## 1. Cómo abrirla
1. Descarga y descomprime el ZIP.
2. Abre la carpeta `desaparecidos_web`.
3. Abre `index.html` en tu navegador. Para editar, abre la carpeta en Visual Studio Code.
4. Recomendado: instala la extensión **Live Server** de VS Code y selecciona `Open with Live Server`.

## 2. Dónde editar
- `index.html`: textos, menú, secciones, tarjetas de casos, enlaces, formulario y espacio de video.
- `style.css`: colores, tamaños, distribución, tarjetas y adaptación a móviles.
- `script.js`: navegación entre paneles, búsqueda, vista previa de foto, validaciones y WhatsApp.
- `img/`: coloca aquí las imágenes autorizadas que vayas a usar.

### Cambiar una imagen
Busca en `index.html` el bloque `hero-image-placeholder` y reemplázalo, por ejemplo, por:
```html
<img class="hero-photo" src="img/portada.jpg" alt="Mensaje de apoyo a las familias">
```
Luego agrega en `style.css`:
```css
.hero-photo {
  width: 100%;
  height: 390px;
  object-fit: cover;
  border-radius: 24px;
}
```
Puedes cambiar `img/portada.jpg` por el nombre del archivo que coloques en `img/`. Usa imágenes propias o con permiso.

### Insertar un video
En `index.html`, dentro de `.video-placeholder`, reemplaza el contenido por un iframe de inserción de la plataforma de video que uses. Comprueba que la fuente permita insertar el video y que no revele datos privados.

### Cambiar WhatsApp
Abre `script.js` y modifica:
```js
whatsappNumber: "593000000000"
```
Coloca el número real con código de país, solo dígitos, sin `+`, espacios ni guiones. El número de ejemplo no está operativo. Un enlace de WhatsApp no es un chatbot con IA: solo abre una conversación con el número configurado. Para un chatbot automatizado necesitas WhatsApp Business Platform/API y un servicio backend.

## 3. Importante: esta plantilla es solo frontend
Los formularios NO envían ni guardan reportes en una base de datos. La vista previa de imagen se mantiene en el navegador. El foro muestra mensajes solo en la vista actual y no los publica en internet. No introduzcas datos reales de personas desaparecidas en esta demostración.

## 4. Paso a paso para una versión real con PHP y MySQL
1. **Diseña la base de datos**: tablas sugeridas `casos`, `contactos_privados`, `imagenes`, `publicaciones_foro`, `usuarios_admin`, `revisiones` y `consentimientos`. Separa los datos privados de contacto de los datos que se mostrarán públicamente.
2. **Crea el backend**: PHP con PDO y consultas preparadas. El servidor debe validar todos los campos; la validación JavaScript no es seguridad.
3. **Carga de imágenes**: comprueba MIME real, tamaño, extensión permitida, nombre aleatorio y autorización; guarda fuera de la carpeta pública cuando sea posible. Nunca confíes en el nombre original del archivo.
4. **Revisión de casos**: al enviar un reporte, guarda estado `pendiente`. Solo una persona administradora autenticada puede aprobarlo. La página pública consulta únicamente los casos aprobados y los campos autorizados.
5. **Foro moderado**: guarda publicaciones como `pendiente`; agrega herramientas para aprobar, rechazar, denunciar contenido y bloquear spam. No permitas publicar teléfonos, direcciones ni acusaciones personales sin revisión.
6. **Acceso administrativo**: contraseñas con `password_hash()` / `password_verify()`, sesiones seguras, protección CSRF, permisos mínimos, límites de intentos y registros de auditoría.
7. **Privacidad**: define consentimiento, finalidad, tiempo de conservación, quién puede ver datos, cómo corregir/eliminar información y un procedimiento para casos de menores. Consulta las obligaciones aplicables en Ecuador, incluida la Ley Orgánica de Protección de Datos Personales.
8. **HTTPS y copias de seguridad**: despliega en hosting con SSL, mantén dependencias actualizadas y prueba restaurar respaldos.
9. **Avisos**: indica claramente que el sitio no reemplaza una denuncia ni es un canal de emergencia. Verifica los enlaces y procedimientos oficiales antes de publicar.

### ¿MySQL, SQL Server o Google Sites?
- **MySQL + PHP**: opción práctica y económica para formularios, carga de imágenes, moderación y un panel administrativo.
- **SQL Server**: también es viable, pero debes crear el backend compatible (por ejemplo, ASP.NET) y configurar el acceso al servidor. No conectes la web pública directamente a la base de datos.
- **Google Sites**: puede servir como prototipo informativo, pero no es suficiente por sí solo para gestionar con seguridad reportes privados, carga de archivos y un foro moderado.

Antes de publicar, verifica los enlaces oficiales y solicita asesoría legal/técnica sobre el tratamiento de información sensible. Evita publicar detalles que puedan poner en riesgo a la persona buscada o a su familia.
