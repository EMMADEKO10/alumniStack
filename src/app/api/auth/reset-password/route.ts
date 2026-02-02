import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token et nouveau mot de passe sont requis.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Trouver l'utilisateur avec le token valide et non expiré
    const user = await db.collection('users').findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Le lien de réinitialisation est invalide ou a expiré.' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour l'utilisateur
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
        },
      }
    );

    return NextResponse.json(
      { message: 'Votre mot de passe a été réinitialisé avec succès.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur Reset Password API:', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
