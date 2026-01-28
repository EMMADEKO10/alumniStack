import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Araka Webhook Received:', body);

    // 1. Extraire les données de la notification
    // La structure dépend de la réponse d'Araka (souvent status, transaction_id, metadata)
    const { status, amount, metadata, transaction_id } = body;

    // 2. Vérifier si le paiement a réussi
    if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'successful') {
      const donationId = metadata?.donationId;

      if (donationId) {
        const { db } = await connectDB();

        // 3. Vérifier si cette transaction a déjà été traitée (idempotence)
        const existingTx = await db.collection('transactions').findOne({ transactionId: transaction_id });
        if (existingTx) {
          console.log(`Transaction ${transaction_id} déjà traitée.`);
          return NextResponse.json({ received: true, already_processed: true });
        }

        // 4. Mettre à jour le montant actuel de la donation
        const updateResult = await db.collection('donations').updateOne(
          { _id: new ObjectId(donationId) },
          { 
            $inc: { currentAmount: parseFloat(amount) },
            $set: { updatedAt: new Date() }
          }
        );

        if (updateResult.modifiedCount > 0) {
          console.log(`Donation ${donationId} mise à jour avec +${amount}`);
          
          // 5. Enregistrer la transaction
          await db.collection('transactions').insertOne({
            transactionId: transaction_id,
            donationId: new ObjectId(donationId),
            amount: parseFloat(amount),
            status: 'SUCCESS',
            date: new Date(),
            customerInfo: body.customer
          });
        }
      }
    }

    // Toujours répondre à Araka pour confirmer la réception du webhook
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Erreur Webhook Araka:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
