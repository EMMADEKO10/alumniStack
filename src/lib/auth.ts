import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';

// Ne pas crasher l'app au démarrage - valider au runtime
function validateAuthConfig() {
  const errors: string[] = [];
  
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('❌ NEXTAUTH_SECRET manquante. Générez-en une avec: openssl rand -base64 32');
  }
  
  if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    errors.push('❌ NEXTAUTH_URL manquante en production. Configurez: https://alumni-launiversity.cd');
  }
  
  if (errors.length > 0) {
    console.error('⚠️ Configuration NextAuth incomplète:\n' + errors.join('\n'));
  }
  
  return errors.length === 0;
}

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Valider la configuration avant toute opération
        if (!validateAuthConfig()) {
          console.error('⚠️ Impossible de s\'authentifier: NextAuth mal configuré');
          return null;
        }
        
        if (!credentials?.email || !credentials?.password) {
          console.warn('Authorize: email ou mot de passe manquant');
          return null;
        }

        try {
          console.log('🔐 Tentative d\'authentification pour:', credentials.email);
          const { db } = await connectDB();

          const normalizedEmail = String(credentials.email).trim();

          const user = await db.collection('users').findOne({
            email: { $regex: `^${normalizedEmail}$`, $options: 'i' }
          });

          if (!user) {
            console.warn('Authorize: utilisateur introuvable pour', normalizedEmail);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.warn('Authorize: mot de passe invalide pour', normalizedEmail);
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            role: user.role || 'user',
          };
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions); 