import LoginForm from '../../components/auth/LoginForm';
import PageTitle from '../../ui/navigation/PageTitle';

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10">
      <PageTitle 
        title="Connexion" 
        content="Connectez-vous à votre compte pour accéder à toutes les fonctionnalités de la plateforme alumni."
      />
      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
} 