import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

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

      // Vérifier si l'utilisateur existe déjà (insensible à la casse)
      const existingUser = await usersCollection.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } });
      if (existingUser) {
        console.log(`L'utilisateur avec l'email ${normalizedEmail} existe déjà`);
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 409 }
        );
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const user: User = {
        email: normalizedEmail,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        role: 'user',
        createdAt: new Date()
      };

      const result = await usersCollection.insertOne(user);

      console.log(`Utilisateur créé avec l'ID: ${result.insertedId}`);

      return NextResponse.json(
        { 
          message: 'Inscription réussie',
          userId: result.insertedId.toString()
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