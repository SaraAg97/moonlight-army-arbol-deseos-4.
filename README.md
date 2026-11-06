# MOONLIGHT ARMY · Árbol de los deseos 🎄💜

Página web estática para que las integrantes compartan deseos navideños en un árbol común.

## Incluye
- Diseño adaptable a celulares y computadores.
- Estética navideña morada, lila, rosa y dorada con guiños BTS/ARMY.
- Formulario con nombre y deseo.
- Tarjetas públicas para leer los deseos.
- Actualización en vivo cuando otra integrante publica.
- Vista de demostración local antes de conectar Supabase.

## 1. Probar en tu computador
Abre `index.html` en el navegador. Sin configurar Supabase, la página funciona en modo demostración y guarda los deseos solo en ese navegador.

## 2. Crear la base de datos en Supabase
1. Entra a https://supabase.com/ y crea un proyecto nuevo.
2. Abre **SQL Editor** y crea una consulta nueva.
3. Copia todo el contenido de `SUPABASE.sql`, ejecútalo y verifica que la tabla `wishes` se haya creado.
4. En **Project Settings > API** (o **Connect**, según la interfaz), copia la Project URL y la clave pública `anon` / `publishable`.
5. Abre `config.js` y reemplaza:
   - `PEGA_AQUI_LA_URL_DE_SUPABASE`
   - `PEGA_AQUI_LA_CLAVE_PUBLICA_ANON`
6. Guarda el archivo.

**Importante:** nunca uses la clave `service_role` en esta página ni la compartas. La clave pública está diseñada para usarse en el navegador junto con las políticas RLS incluidas.

## 3. Publicar con GitHub + Cloudflare Pages
1. Crea un repositorio nuevo en GitHub, por ejemplo `moonlight-army-arbol-deseos`.
2. Sube los archivos de esta carpeta a la raíz del repositorio (incluye `index.html`, `styles.css`, `app.js`, `config.js` y `SUPABASE.sql`).
3. Entra a https://dash.cloudflare.com/ y abre **Workers & Pages**.
4. Selecciona **Create application > Pages > Connect to Git**.
5. Conecta GitHub y elige el repositorio.
6. Framework preset: **None**. Build command: déjalo vacío. Build output directory: `/` o `.`.
7. Pulsa **Save and Deploy**.
8. Cloudflare te dará un enlace `https://...pages.dev` para compartir en el grupo.

## Notas
- Cualquier persona con el enlace puede leer y publicar deseos; no se pide contraseña, tal como se planteó para la dinámica.
- Esta primera versión no permite editar ni borrar deseos desde la página.
- Si se comparte públicamente el enlace, los nombres y deseos también serán públicos para quienes lo tengan.
- Para controlar spam o añadir moderación, se puede agregar una clave de acceso o aprobación de administradora en una siguiente versión.
