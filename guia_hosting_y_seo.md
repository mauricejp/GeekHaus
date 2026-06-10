# Guía de Hosting y Tráfico Orgánico para Geek Haus

Para lograr **URLs limpias** (como `sitio.com/catalogo` en lugar de `sitio.com/catalogo.html`) y conseguir **tráfico por sí solo** (SEO orgánico), te recomendamos migrar tu hosting a **Vercel** o **Netlify** y aplicar las siguientes estrategias de posicionamiento.

---

## 🚀 Parte 1: Configurar URLs Limpias (Vercel o Netlify)

GitHub Pages es excelente, pero no tiene una opción nativa sencilla para remover el `.html` de las URLs sin cambiar toda la estructura de carpetas de tu código. **Vercel** y **Netlify** resuelven esto de forma automática.

### Opción A: Desplegar en Vercel (Recomendado)
1. Crea una cuenta gratuita en [vercel.com](https://vercel.com/) iniciando sesión con tu cuenta de **GitHub**.
2. Haz clic en **"Add New"** > **"Project"**.
3. Importa tu repositorio `mauricejp/GeekHaus`.
4. En **Framework Preset**, selecciona **Other** (ya que es un proyecto de HTML puro).
5. Vercel tiene activada la opción **Clean URLs** por defecto. Si necesitas verificarlo, una vez creado el proyecto ve a:
   * *Settings > General > scroll hasta "Clean URLs" > Asegúrate de que esté habilitado*.
6. Haz clic en **Deploy**. ¡Listo! Ya puedes acceder a `/catalogo` sin escribir `.html`.

### Opción B: Desplegar en Netlify
1. Crea una cuenta gratuita en [netlify.com](https://netlify.com/) con tu cuenta de **GitHub**.
2. Haz clic en **"Add new site"** > **"Import an existing project" y elige GitHub**.
3. Selecciona tu repositorio y haz clic en **Deploy**.
4. Netlify activa las "Pretty URLs" de forma automática. Si deseas asegurarte de que redireccione correctamente, puedes agregar un archivo vacío llamado `_redirects` en la raíz del proyecto con la siguiente línea:
   ```text
   /catalogo   /catalogo.html   200
   ```

---

## 📈 Parte 2: ¿Cómo conseguir tráfico "por sí solo" (Orgánico)?

Un sitio web nuevo no recibe tráfico automáticamente; necesita que Google sepa que existe y que las búsquedas locales apunten a él. Sigue estos pasos clave:

### 1. SEO Técnico (¡Ya implementado en tus archivos!)
Hemos editado tus archivos HTML agregando etiquetas críticas para los motores de búsqueda:
* **Idioma:** Cambiado de `en` a `es` (Español) para que Google entienda que tu público objetivo habla español.
* **Meta Description:** Añadimos descripciones atractivas sobre tus servicios en Paraguay (impresión 3D, figuras, mangas) para que aparezcan en los resultados de búsqueda.
* **Keywords:** Añadimos palabras clave como `impresion 3d paraguay` para ayudar al motor de búsqueda a categorizarte.
* **Open Graph (OG):** Añadimos etiquetas para que, cuando compartas tu enlace por WhatsApp, Instagram o Facebook, se muestre una tarjeta con el logo, título y descripción atractiva en lugar de un enlace simple.

### 2. Google Search Console (Imprescindible para aparecer en Google)
Para que Google indexe tu web rápidamente en lugar de esperar meses:
1. Entra en [Google Search Console](https://search.google.com/search-console).
2. Registra tu nuevo dominio (el que te dé Vercel/Netlify o tu dominio propio).
3. Sigue las instrucciones para verificar que eres el dueño.
4. Usa la herramienta **"Inspección de URLs"** para solicitar la indexación de tu página de inicio (`/`) y del catálogo (`/catalogo`). Esto le dice formalmente a Google: *"Mi web existe, por favor agrégala a tu buscador"*.

### 3. Google Business Profile (El canal #1 de tráfico local)
Al vender en Paraguay (con precios en Guaraníes), tu tráfico más valioso es local. 
1. Crea un perfil gratuito en [Google Business Profile](https://www.google.com/business/).
2. Registra **"Geek Haus"** como negocio de servicios o tienda (puedes ocultar tu dirección física si trabajas desde casa y seleccionar zonas de entrega como Asunción, Gran Asunción, etc.).
3. En la sección de información, **agrega el enlace a tu nueva web limpia**.
4. Pide a tus clientes que te dejen reseñas en Google. Cuando alguien busque *"impresion 3d paraguay"* o *"regalos geek cerca de mi"*, aparecerás en los resultados de Google Maps, lo cual genera visitas orgánicas de alta calidad diariamente y gratis.

### 4. Redes Sociales y Enlaces Externos
* Pon tu enlace limpio en la biografía de Instagram (`@geekhaus.py`).
* Comparte el enlace en foros o comunidades locales de tecnología, anime o gaming en Paraguay cuando la gente busque dónde imprimir piezas 3D.
