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
        console.log(`L'utilisateur avec l'email ${normalizedEmail} existe déjà`);
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 409 }
        );
      }

      // Vérifier s'il y a déjà une inscription en attente
      const existingPending = await pendingUsersCollection.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } });
      if (existingPending) {
        console.log(`Un compte en attente existe déjà pour ${normalizedEmail}`);
        return NextResponse.json(
          { error: 'Un compte en attente existe déjà pour cet email. Vérifiez votre boîte mail.' },
          { status: 409 }
        );
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Générer un token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

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

      console.log(`Utilisateur créé avec l'ID: ${result.insertedId}`);

      // Construire le lien de vérification
      const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';
      const verifyUrl = `${origin}/api/auth/verify?token=${verificationToken}`;

      try {
        // Import dynamique pour compatibilité CJS
        const { sendEmail } = await import('../../../../utils/sendEmails.js');
        await sendEmail(
          normalizedEmail,
          'Vérifiez votre adresse e-mail',
          `Bienvenue! Veuillez confirmer votre inscription en cliquant: ${verifyUrl}`,
          `<p>Bienvenue!</p><p>Veuillez confirmer votre inscription en cliquant sur le lien ci-dessous:</p><p><a href="${verifyUrl}">Confirmer mon inscription</a></p><p>Ce lien expire dans 24 heures.</p>`
        );
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
        // Ne pas échouer l'inscription si l'envoi d'email échoue
      }

      return NextResponse.json(
        {
          message: 'Inscription reçue. Vérifiez votre e-mail pour activer votre compte.',
          pendingId: result.insertedId.toString()
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