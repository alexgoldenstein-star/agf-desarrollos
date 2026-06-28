// api/create-user.js
// Vercel Serverless Function — crea usuarios en Firebase Auth
// Solo puede ser llamada por admins autenticados

const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK (una sola vez)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const ADMIN_EMAILS = ['alex@nivikostore.com', 'brian@iuraba.com.ar'];

module.exports = async (req, res) => {
  // CORS
  const allowedOrigins = ['https://www.agfdesarrollos.com','https://agfdesarrollos.com','https://alexgoldenstein-star.github.io'];
  const origin = req.headers.origin;
  if(allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  else res.setHeader('Access-Control-Allow-Origin', 'https://www.agfdesarrollos.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Verify caller is an admin
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    if (!ADMIN_EMAILS.includes(decoded.email)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { email, nombre, action, uid } = req.body;

    if (action === 'create') {
      // Create user with temporary password — user must reset via email
      const tempPassword = 'AGF_' + Math.random().toString(36).slice(2, 10) + '!';
      const userRecord = await admin.auth().createUser({
        email,
        password: tempPassword,
        displayName: nombre,
        emailVerified: false,
      });

      // Send password reset email so user can set their own password
      const resetLink = await admin.auth().generatePasswordResetLink(email);

      return res.status(200).json({
        success: true,
        uid: userRecord.uid,
        resetLink,
        message: `Usuario creado. UID: ${userRecord.uid}`,
      });
    }

    if (action === 'reset') {
      // Send password reset email
      const resetLink = await admin.auth().generatePasswordResetLink(email);
      return res.status(200).json({ success: true, resetLink });
    }

    if (action === 'delete') {
      await admin.auth().deleteUser(uid);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Acción no válida' });

  } catch (error) {
    console.error('Error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Este email ya tiene una cuenta.' });
    }
    return res.status(500).json({ error: error.message });
  }
};
