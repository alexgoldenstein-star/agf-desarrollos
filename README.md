# AGF Desarrollos — Guía de Deploy

## Estructura de archivos
```
agf-desarrollos/
├── index.html          ← Sitio público principal
├── logo.png            ← Logo AGF (blanco sobre negro)
├── admin/
│   └── index.html      ← Panel admin (login con Firebase Auth)
└── README.md
```

## Paso 1 — Subir a GitHub

```bash
git init
git add .
git commit -m "AGF Desarrollos v1.0"
git remote add origin https://github.com/TU_USUARIO/agf-desarrollos.git
git push -u origin main
```

## Paso 2 — Activar GitHub Pages

1. Ir a tu repo → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main** / folder: **/ (root)**
4. Guardar → en ~2 min el sitio está en `TU_USUARIO.github.io/agf-desarrollos`

## Paso 3 — Conectar dominio agfdesarrollos.com (SSL gratis automático)

En el panel de tu registrador de dominio (NIC.ar, Donweb, Namecheap, etc.):

### Registros DNS a crear:

| Tipo  | Nombre | Valor                |
|-------|--------|----------------------|
| A     | @      | 185.199.108.153      |
| A     | @      | 185.199.109.153      |
| A     | @      | 185.199.110.153      |
| A     | @      | 185.199.111.153      |
| CNAME | www    | TU_USUARIO.github.io |

### En GitHub Pages (Settings → Pages → Custom domain):
- Escribir: `agfdesarrollos.com`
- Tildar: **Enforce HTTPS** ✓

**El SSL (certificado HTTPS) lo genera GitHub automáticamente vía Let's Encrypt.**
Demora entre 15 minutos y 24 hs en propagarse.

---

## Paso 4 — Configurar Firestore (reglas de seguridad)

En Firebase Console → Firestore → Rules, pegar esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Proyectos: lectura pública, escritura solo autenticados
    match /proyectos/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Config: lectura pública, escritura solo autenticados
    match /config/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Panel Admin

URL: `https://agfdesarrollos.com/admin/`

Usuarios habilitados:
- alex@nivikostore.com
- brian@iuraba.com.ar

(Si el login no funciona, verificar en Firebase Console → Authentication → Users que estén creados)

## Nota sobre SSL

GitHub Pages genera el SSL automáticamente. No se necesita pagar Cloudflare ni ningún servicio externo.
Si ves error de certificado las primeras horas, es normal — esperá que se propague el DNS.

