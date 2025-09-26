import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
  }

  try {
    const { db } = await connectDB();

    // 1) Vérifier s'il existe déjà un utilisateur actif avec ce token (compat rétro)
    const existingUser = await db.collection('users').findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (existingUser) {
      await db.collection('users').updateOne(
        { _id: existingUser._id },
        {
          $set: { isVerified: true },
          $unset: { verificationToken: '', verificationExpires: '' },
        }
      );
    } else {
      // 2) Chercher dans pendingUsers
      const pending = await db.collection('pendingUsers').findOne({
        verificationToken: token,
        verificationExpires: { $gt: new Date() },
      });

      if (!pending) {
        const redirectUrl = new URL('/login', requestUrl.origin);
        redirectUrl.searchParams.set('error', 'invalid_or_expired');
        redirectUrl.searchParams.set('next', '/profile/complete');
        return NextResponse.redirect(redirectUrl);
      }

      // 3) Déplacer de pendingUsers -> users (upsert sécurisé)
      const { _id, verificationToken, verificationExpires, ...userData } = pending as any;

      // Assurer unicité par email
      const existingByEmail = await db.collection('users').findOne({ email: pending.email });
      if (existingByEmail) {
        // Déjà activé d'une autre manière; nettoyer l'entrée pending
        await db.collection('pendingUsers').deleteOne({ _id });
      } else {
        await db.collection('users').insertOne({
          ...userData,
          isVerified: true,
          createdAt: userData.createdAt || new Date(),
        });
        await db.collection('pendingUsers').deleteOne({ _id });
      }
    }

    // Rediriger vers la page de connexion avec redirection vers la complétion du profil
    const successUrl = new URL('/login', requestUrl.origin);
    successUrl.searchParams.set('verified', '1');
    successUrl.searchParams.set('next', '/profile/complete');
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Erreur de vérification de l\'email:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


