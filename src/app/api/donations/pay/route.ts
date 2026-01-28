import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { amount, donationId, customerName, phoneNumber, customerEmail } = await req.json();

    if (!amount || !donationId) {
      return NextResponse.json({ error: 'Montant et ID de donation requis' }, { status: 400 });
    }

    // 1. Vérifier si la donation existe
    const { db } = await connectDB();
    const donation = await db.collection('donations').findOne({ _id: new ObjectId(donationId) });

    if (!donation) {
      return NextResponse.json({ error: 'Campagne de donation non trouvée' }, { status: 404 });
    }

    // 2. Initialiser la transaction auprès d'Araka Pay
    // Note: L'URL exacte et les paramètres peuvent varier selon la version de l'API Araka.
    // Nous utilisons ici une structure standard basée sur la documentation fournie.
    const response = await fetch(`${process.env.ARAKA_API_URL}payments/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ARAKA_CLIENT_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: process.env.ARAKA_MERCHANT_ID,
        amount: amount,
        currency: 'USD',
        description: `Don pour: ${donation.title}`,
        customer_name: customerName || 'Anonyme',
        customer_email: customerEmail,
        customer_phone: phoneNumber,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/donations/callback`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/donations/success`,
        metadata: { 
          donationId: donationId,
          type: 'donation'
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Araka Pay:', errorData);
      return NextResponse.json({ error: 'Erreur lors de l\'initialisation du paiement chez Araka' }, { status: 500 });
    }

    const data = await response.json();
    
    // On retourne l'URL de paiement fournie par Araka
    return NextResponse.json({ 
      paymentUrl: data.payment_url || data.url, 
      transactionId: data.transaction_id 
    });

  } catch (error) {
    console.error('Erreur initialisation paiement:', error);
    return NextResponse.json({ error: 'Échec de l\'initialisation du paiement' }, { status: 500 });
  }
}
