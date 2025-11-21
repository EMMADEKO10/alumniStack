import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

// Vérification de la variable d'environnement en mode développement uniquement
let uri = process.env.MONGODB_URI;

// Fallback pour le développement
if (!uri && process.env.NODE_ENV === 'development') {
  console.warn('Variable MONGODB_URI non définie, utilisation de l\'URI par défaut pour le développement');
  uri =process.env.MONGODB_URI;
} else if (!uri) {
  throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI');
}

export async function POST(request: Request) {
  try {
    // Vérifier que la requête est bien au format JSON
    let requestData: RegisterData;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = requestData;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Création d'une nouvelle instance pour chaque requête
    const client = new MongoClient(uri!);

    try {
      await client.connect();
      console.log('Connecté à MongoDB');

      // Extraire le nom de la base de données de l'URI
      let dbName = process.env.MONGODB_DB_NAME;
      if (!dbName && uri!.includes('/')) {
        const uriParts = uri!.split('/');
        const lastPart = uriParts[uriParts.length - 1];
        dbName = lastPart.split('?')[0];
      }
      if (!dbName || dbName === '') {
        dbName = 'alumniprod';
      }

      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const pendingUsersCollection = db.collection('pendingUsers');

      // Vérifier si l'utilisateur existe déjà (insensible à la casse) dans users
      const existingUser = await usersCollection.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } });
      if (existingUser) {
        console.log(`L'utilisateur avec l'email ${normalizedEmail} existe déjà (compte vérifié)`);
        return NextResponse.json(
          { error: 'Un compte vérifié existe déjà avec cet email. Veuillez vous connecter ou réinitialiser votre mot de passe.' },
          { status: 409 }
        );
      }

      // Vérifier s'il y a déjà une inscription en attente
      const existingPending = await pendingUsersCollection.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } });
      
      let verificationToken: string;
      let verificationExpires: Date;
      let hashedPassword: string;
      let pendingId: string;

      if (existingPending) {
        console.log(`Un compte en attente existe déjà pour ${normalizedEmail}. Mise à jour et renvoi de l'email.`);
        
        // Générer un nouveau token et mettre à jour les données
        verificationToken = crypto.randomBytes(32).toString('hex');
        verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
        hashedPassword = await bcrypt.hash(password, 10);

        // Mettre à jour le compte en attente avec les nouvelles données
        await pendingUsersCollection.updateOne(
          { email: { $regex: `^${normalizedEmail}$`, $options: 'i' } },
          {
            $set: {
              password: hashedPassword,
              firstName: firstName || existingPending.firstName || '',
              lastName: lastName || existingPending.lastName || '',
              verificationToken,
              verificationExpires,
              updatedAt: new Date()
            }
          }
        );

        pendingId = existingPending._id.toString();
        console.log(`Compte en attente mis à jour pour ${normalizedEmail}`);
      } else {
        // Nouveau compte en attente
        // Hachage du mot de passe
        hashedPassword = await bcrypt.hash(password, 10);

        // Générer un token de vérification
        verificationToken = crypto.randomBytes(32).toString('hex');
        verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

        // Création du document pending user
        const pendingUser: User = {
          email: normalizedEmail,
          password: hashedPassword,
          firstName: firstName || '',
          lastName: lastName || '',
          role: 'user',
          createdAt: new Date(),
          // @ts-ignore - champs additionnels non typés dans l'interface User locale
          isVerified: false,
          // @ts-ignore
          verificationToken,
          // @ts-ignore
          verificationExpires
        };

        const result = await pendingUsersCollection.insertOne(pendingUser);
        pendingId = result.insertedId.toString();
        console.log(`Nouvel utilisateur en attente créé avec l'ID: ${pendingId}`);
      }

      // Construire le lien de vérification
      const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const verifyUrl = `${origin}/api/auth/verify?token=${verificationToken}`;

      try {
        // Import dynamique pour compatibilité CJS
        const { sendEmail } = await import('../../../../utils/sendEmails.js');
        const { verificationEmailTemplate, verificationEmailText } = await import('../../../../utils/emailTemplates.js');
        
        const htmlContent = verificationEmailTemplate(verifyUrl, firstName, origin);
        const textContent = verificationEmailText(verifyUrl, firstName);
        
        await sendEmail(
          normalizedEmail,
          '🎓 Bienvenue sur LAU Alumni - Vérifiez votre compte',
          textContent,
          htmlContent
        );
        
        console.log(`Email de vérification envoyé à ${normalizedEmail}`);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
        // Ne pas échouer l'inscription si l'envoi d'email échoue
      }

      return NextResponse.json(
        {
          message: 'Inscription reçue. Vérifiez votre e-mail pour activer votre compte.',
          pendingId: pendingId,
          updated: existingPending ? true : false
        },
        { status: 201 }
      );
    } finally {
      await client.close();
      console.log('Connexion MongoDB fermée');
    }

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 