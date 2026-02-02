import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import { sendEmail } from '@/utils/sendEmails';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'L\'adresse email est requise.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Vérifier si l'utilisateur existe
    const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
      return NextResponse.json(
        { message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.' },
        { status: 200 }
      );
    }

    // Générer un token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure

    // Enregistrer dans la base de données
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        },
      }
    );

    // Envoyer l'email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const emailSubject = 'Réinitialisation de votre mot de passe - Alumni Platform';
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #d32f2f; text-align: center;">Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte sur la plateforme Alumni.</p>
        <p>Veuillez cliquer sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien est valable pendant 1 heure.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Réinitialiser mon mot de passe</a>
        </div>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe restera inchangé.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    `;

    const emailSent = await sendEmail(email, emailSubject, emailContent);

    if (!emailSent) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
      return NextResponse.json(
        { message: 'Erreur lors de l\'envoi de l\'email.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur Forgot Password:', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
