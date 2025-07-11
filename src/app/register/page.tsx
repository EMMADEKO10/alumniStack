import RegisterForm from '../../components/auth/RegisterForm';
import PageTitle from '../../ui/navigation/PageTitle';

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10">
      <PageTitle 
        title="Inscription" 
        content="Rejoignez notre communauté d'alumni et accédez à toutes les fonctionnalités de la plateforme."
      />
      <div className="mt-10">
        <RegisterForm />
      </div>
    </div>
  );
} 