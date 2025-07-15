// Script de test pour l'API alumni
const testAlumniAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  // Données de test pour un profil alumni
  const testProfileData = {
    personalInfo: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@test.com",
      phone: "+33123456789",
      bio: "Diplômé en informatique, passionné par les nouvelles technologies",
      linkedinUrl: "https://linkedin.com/in/jean-dupont",
    },
    academicInfo: {
      facultyId: "FACULTE_INFORMATIQUE",
      departmentName: "Informatique",
      specializationField: "Développement Web",
      degreeLevel: "Master",
      degreeTitle: "Master en Informatique",
      graduationYear: 2022,
    },
    contactInfo: {
      currentAddress: {
        street: "123 Rue de Test",
        city: "Paris",
        province: "Île-de-France",
        country: "France",
        postalCode: "75001"
      }
    },
    professionalInfo: {
      currentPosition: {
        jobTitle: "Développeur Full Stack",
        company: "Tech Corp",
        industry: "Technologie",
        startDate: "2022-06-01",
        description: "Développement d'applications web modernes"
      },
      skills: ["JavaScript", "React", "Node.js", "Python"]
    }
  };

  console.log('=== Test de l\'API Alumni ===');
  console.log('URL de base:', baseURL);
  console.log('Données de test:', JSON.stringify(testProfileData, null, 2));

  try {
    // Test 1: Vérifier la session
    console.log('\n1. Test de la session...');
    const sessionResponse = await fetch(`${baseURL}/api/auth/session`);
    const sessionData = await sessionResponse.json();
    console.log('Session:', sessionData);

    if (!sessionData.user) {
      console.log('❌ Utilisateur non connecté. Veuillez vous connecter d\'abord.');
      return;
    }

    // Test 2: Essayer de créer un profil
    console.log('\n2. Test de création de profil...');
    const createResponse = await fetch(`${baseURL}/api/alumni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProfileData),
    });

    console.log('Status:', createResponse.status);
    console.log('Status Text:', createResponse.statusText);

    const createResult = await createResponse.json();
    console.log('Résultat:', createResult);

    if (createResponse.ok) {
      console.log('✅ Profil créé avec succès!');
    } else {
      console.log('❌ Erreur lors de la création:', createResult.error);
    }

    // Test 3: Récupérer le profil créé
    console.log('\n3. Test de récupération de profil...');
    const getResponse = await fetch(`${baseURL}/api/alumni?userId=${sessionData.user.id}`);
    const getResult = await getResponse.json();
    console.log('Profil récupéré:', getResult);

  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
};

// Exporter pour utilisation dans le navigateur
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testAlumniAPI;
} else {
  window.testAlumniAPI = testAlumniAPI;
}

console.log('Script de test chargé. Utilisez testAlumniAPI() pour lancer le test.'); 