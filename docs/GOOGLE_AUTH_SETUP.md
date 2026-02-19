# Configuración de Google OAuth para NextAuth

Para obtener el `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`, seguí estos pasos:

## 1. Crear un Proyecto en Google Cloud Platform
1. Andá a [Google Cloud Console](https://console.cloud.google.com/).
2. Iniciá sesión con tu cuenta de Google.
3. Hacé clic en el desplegable de proyectos (arriba a la izquierda) y seleccioná **"New Project"** (Nuevo Proyecto).
4. Ponele un nombre (ej: `FanNews`) y dale a **"Create"**.

## 2. Configurar la Pantalla de Consentimiento (OAuth Consent Screen)
1. En el menú lateral izquierdo, andá a **"APIs & Services"** > **"OAuth consent screen"**.
2. Seleccioná **"External"** (para que cualquier usuario con cuenta de Google pueda entrar) y dale a **"Create"**.
3. Llená los datos obligatorios:
   - **App name**: `FanNews` (o el nombre que quieras).
   - **User support email**: Tu email.
   - **Developer contact information**: Tu email.
4. Dale a **"Save and Continue"** en las siguientes pantallas (no hace falta agregar "Scopes" especiales por ahora, con los default alcanza: `email`, `profile`, `openid`).
5. En la pantalla de **"Test Users"**, podés agregar tu propio email para probar mientras la app esté en modo "Testing".

## 3. Crear las Credenciales
1. En el menú lateral izquierdo, andá a **"Credentials"**.
2. Hacé clic en **"+ CREATE CREDENTIALS"** y elegí **"OAuth client ID"**.
3. En **"Application type"**, seleccioná **"Web application"**.
4. Ponele un nombre (ej: `NextAuth Client`).
5. **IMPORTANTE - Authorized JavaScript origins**:
   - Agregá: `http://localhost:3000`
   - Agregá: `http://localhost:3002` (como estamos usando este puerto a veces)
   - Agregá: `http://localhost:3003` (por si acaso)
6. **IMPORTANTE - Authorized redirect URIs**:
   - Agregá: `http://localhost:3000/api/auth/callback/google`
   - Agregá: `http://localhost:3002/api/auth/callback/google`
   - Agregá: `http://localhost:3003/api/auth/callback/google`
   *(NextAuth usa esta ruta por defecto).*
7. Dale a **"Create"**.

## 4. Obtener ID y Secret
1. Una vez creado, te va a mostrar un popup con "Your Client ID" y "Your Client Secret".
2. Copialos y pegalos en tu archivo `.env.local`:

```env
AUTH_GOOGLE_ID=tu_cliente_id_copiado
AUTH_GOOGLE_SECRET=tu_cliente_secret_copiado
```

## 5. Reiniciar el Servidor
Después de guardar el `.env.local`, pará el servidor (`Ctrl+C`) y volvé a correr `npm run dev` para que tome los cambios.
