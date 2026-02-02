import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  console.log('--- NOUVELLE TENTATIVE DE PAIEMENT ---');
  try {
    const body = await req.json();
    const { amount, donationId, customerName, phoneNumber, customerEmail, paymentMethod = 'MOBILEMONEY', provider, walletID } = body;

    console.log('Paramètres reçus:', { amount, donationId, paymentMethod });

    if (!amount || !donationId) {
      return NextResponse.json({ error: 'Montant et ID de donation requis' }, { status: 400 });
    }

    // 1. Connexion DB avec timeout court
    console.log('1. Connexion MongoDB...');
    const dbPromise = connectDB();
    const { db } = await Promise.race([
      dbPromise,
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout MongoDB')), 8000))
    ]);
    console.log('✓ MongoDB connecté');

    const donation = await db.collection('donations').findOne({ _id: new ObjectId(donationId) });
    if (!donation) {
      return NextResponse.json({ error: 'Campagne de donation non trouvée' }, { status: 404 });
    }

    // 2. Login Araka Pay
    const baseUrl = (process.env.ARAKA_API_URL || 'https://api.arakapay.com/api').replace(/\/$/, '');
    console.log(`2. Tentative de login Araka sur: ${baseUrl}/login`);
    
    if (!process.env.ARAKA_EMAIL || !process.env.ARAKA_PASSWORD) {
      throw new Error('Identifiants Araka manquants dans le .env');
    }

    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailAddress: process.env.ARAKA_EMAIL,
        password: process.env.ARAKA_PASSWORD,
      }),
    }).catch(err => {
      console.error('Erreur réseau / Login Araka:', err.message);
      throw new Error('Impossible de contacter le serveur Araka Pay (Vérifiez votre connexion internet)');
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('Échec Login Araka:', loginResponse.status, errorText);
      return NextResponse.json({ error: `Araka Pay: Erreur d'authentification (${loginResponse.status})` }, { status: 500 });
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✓ Login Araka réussi');

    // 3. Préparer la transaction
    // Nettoyage des variables d'environnement
    const paymentPageId = (process.env.ARAKA_PAYMENT_PAGE_ID || '').trim();
    const cleanPhone = (phoneNumber || '0').replace(/[\+\s]/g, '');
    const cleanWalletID = (walletID || '').replace(/[\+\s]/g, '') || cleanPhone;
    const transactionReference = `AUA${Date.now()}`;
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    const paymentRequest: any = {
      order: {
        paymentPageId: paymentPageId,
        customerFullName: customerName || 'Donateur LAU',
        customerPhoneNumber: cleanPhone,
        customerEmailAddress: customerEmail || 'donor@launiversity.cd',
        transactionReference: transactionReference,
        amount: parseFloat(amount),
        currency: 'USD',
        redirectURL: `${appUrl}/donations/success?transactionId=${transactionReference}`,
      },
      paymentChannel: {
        channel: paymentMethod,
      }
    };

    if (paymentMethod === 'MOBILEMONEY') {
      paymentRequest.paymentChannel.provider = provider;
      paymentRequest.paymentChannel.walletID = cleanWalletID;
    }

    console.log('3. Envoi requête de paiement à Araka Pay...');
    // Log du corps de la requête pour débogage (sans infos sensibles)
    console.log('Corps de la requête:', JSON.stringify({
      ...paymentRequest,
      order: { ...paymentRequest.order, paymentPageId: '***' }
    }));

    const response = await fetch(`${baseUrl}/pay/paymentrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur Araka Request:', errorData);
      return NextResponse.json({ error: 'Araka Pay a refusé la requête de paiement' }, { status: 500 });
    }

    const data = await response.json();
    console.log('✓ Transaction Araka créée:', data.transactionId);
    
    // 5. Enregistrer la transaction
    console.log('4. Enregistrement transaction en DB...');
    await db.collection('transactions').insertOne({
      transactionId: data.transactionId,
      transactionReference,
      donationId: new ObjectId(donationId),
      amount: parseFloat(amount),
      status: 'PENDING',
      method: paymentMethod,
      provider: provider || 'CARD',
      customerInfo: { name: customerName, email: customerEmail, phone: phoneNumber },
      createdAt: new Date()
    });
    console.log('✓ Fin du processus API');

    return NextResponse.json({ 
      paymentUrl: data.paymentPage,
      transactionId: data.transactionId,
      success: true
    });

  } catch (error: any) {
    console.error('--- ERREUR CRITIQUE API PAY ---');
    console.error(error);
    return NextResponse.json({ 
      error: error.message || 'Une erreur imprévue est survenue au niveau du serveur.' 
    }, { status: 500 });
  }
}
