import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const token = searchParams.get('token');

  console.log('🔐 Vérification email - Début');
  console.log('  - Token reçu:', token?.substring(0, 10) + '...');
  console.log('  - APP_URL:', process.env.APP_URL);
  console.log('  - NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('  - Request URL:', request.url);

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
        console.log('❌ Token invalide ou expiré');
        
        // Utiliser APP_URL (variable serveur) en priorité
        let baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
        
        if (!baseUrl) {
          const headerXForwardedHost = request.headers.get('x-forwarded-host');
          const headerXForwardedProto = request.headers.get('x-forwarded-proto') || 'https';
          const headerHost = request.headers.get('host');
          
          if (headerXForwardedHost) {
            baseUrl = `${headerXForwardedProto}://${headerXForwardedHost}`;
          } else if (headerHost) {
            const protocol = headerHost.includes('localhost') || headerHost.includes('127.0.0.1') ? 'http' : 'https';
            baseUrl = `${protocol}://${headerHost}`;
          } else {
            baseUrl = requestUrl.origin;
          }
        }
        
        baseUrl = baseUrl.replace(/\/$/, '');
        
        const redirectUrl = new URL('/login', baseUrl);
        redirectUrl.searchParams.set('error', 'invalid_or_expired');
        redirectUrl.searchParams.set('next', '/profile/complete');
        return NextResponse.redirect(redirectUrl);
      }

      // 3) Déplacer de pendingUsers -> users (upsert sécurisé)
      const { _id, verificationToken, verificationExpires, ...userData } = pending as { 
        _id: import('mongodb').ObjectId; 
        verificationToken: string; 
        verificationExpires: Date; 
        email: string;
        [key: string]: unknown 
      };

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
    // Utiliser APP_URL (variable serveur) en priorité
    let baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
    
    // Si aucune variable d'environnement, construire depuis les headers
    if (!baseUrl) {
      const headerXForwardedHost = request.headers.get('x-forwarded-host');
      const headerXForwardedProto = request.headers.get('x-forwarded-proto') || 'https';
      const headerHost = request.headers.get('host');
      
      if (headerXForwardedHost) {
        baseUrl = `${headerXForwardedProto}://${headerXForwardedHost}`;
      } else if (headerHost) {
        const protocol = headerHost.includes('localhost') || headerHost.includes('127.0.0.1') ? 'http' : 'https';
        baseUrl = `${protocol}://${headerHost}`;
      } else {
        baseUrl = requestUrl.origin;
      }
    }
    
    // Nettoyer l'URL: retirer le slash final
    baseUrl = baseUrl.replace(/\/$/, '');
    
    console.log('✅ Vérification réussie, redirection vers:', `${baseUrl}/login?verified=1`);
    
    const successUrl = new URL('/login', baseUrl);
    successUrl.searchParams.set('verified', '1');
    successUrl.searchParams.set('next', '/profile/complete');
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Erreur de vérification de l\'email:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


