# AGF Desarrollos — Setup Completo

## PROBLEMA DE ACCESO AL ADMIN (resolución inmediata)

Si no podés entrar con alex@nivikostore.com o brian@iuraba.com.ar:

1. Firebase Console → Authentication → Users
2. Si no aparecen → Add user → email + contraseña que quieras
3. Listo, ya podés entrar al admin

---

## PASO 1 — Firestore Rules
Firebase Console → Firestore → Rules → pegá el contenido de `firestore.rules` → Publicar.

---

## PASO 2 — API para crear usuarios (Vercel)

### 2a. Obtener Service Account Key
Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada → descargás un JSON.

### 2b. Variables de entorno en Vercel
Vercel Dashboard → tu proyecto → Settings → Environment Variables:

| Variable | Valor del JSON |
|----------|----------------|
| FIREBASE_PROJECT_ID | agf-desarrollos |
| FIREBASE_CLIENT_EMAIL | el client_email del JSON |
| FIREBASE_PRIVATE_KEY | el private_key del JSON |

### 2c. Deploy
Conectá el repo agf-desarrollos en vercel.com → Import → Deploy.
La API queda en: https://agf-desarrollos.vercel.app/api/create-user

---

## FLUJO para crear un inversor

1. Admin → Inversores → Nuevo inversor
2. Completás todos los datos + cuotas
3. Guardás → el sistema crea la cuenta automáticamente
4. Aparece un link → lo mandás al inversor por WA o email
5. El inversor entra, pone su contraseña y accede a portal.html

---

## URLs del sistema
- Sitio: agfdesarrollos.com
- Portal inversores: agfdesarrollos.com/portal.html
- Dashboard inversor: agfdesarrollos.com/dashboard.html
- Admin: agfdesarrollos.com/admin/
