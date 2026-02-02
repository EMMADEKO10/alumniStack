import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'ID de transaction requis' }, { status: 400 });
    }

    const { db } = await connectDB();

    // 1. Vérifier si la transaction existe déjà et son statut
    const transaction = await db.collection('transactions').findOne({ transactionId });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction non trouvée' }, { status: 404 });
    }

    if (transaction.status === 'SUCCESS') {
      return NextResponse.json({ success: true, message: 'Déjà confirmée' });
    }

    // 2. Vérifier le statut réel auprès d'Araka Pay
    const baseUrl = process.env.ARAKA_API_URL || 'https://api.arakapay.com/api';
    
    // Login pour obtenir le token
    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailAddress: process.env.ARAKA_EMAIL,
        password: process.env.ARAKA_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      return NextResponse.json({ error: 'Erreur d\'authentification Araka' }, { status: 500 });
    }

    const { token } = await loginResponse.json();

    // Vérifier le statut
    const statusResponse = await fetch(`${baseUrl}/reporting/transactionstatus/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      return NextResponse.json({ error: 'Erreur lors de la vérification du statut Araka' }, { status: 500 });
    }

    const statusData = await statusResponse.json();

    // 3. Mettre à jour si approuvé
    if (statusData.status === 'APPROVED') {
      const donationId = transaction.donationId;

      // Mettre à jour le montant de la donation
      await db.collection('donations').updateOne(
        { _id: new ObjectId(donationId) },
        { 
          $inc: { currentAmount: transaction.amount },
          $set: { updatedAt: new Date() }
        }
      );

      // Mettre à jour le statut de la transaction
      await db.collection('transactions').updateOne(
        { _id: transaction._id },
        { 
          $set: { 
            status: 'SUCCESS',
            updatedAt: new Date(),
            arakaStatus: statusData
          }
        }
      );

      return NextResponse.json({ success: true, status: 'APPROVED' });
    }

    return NextResponse.json({ success: false, status: statusData.status });

  } catch (error) {
    console.error('Erreur confirmation donation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
