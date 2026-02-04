import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Araka Webhook Received:', body);

    // 1. Extraire les données de la notification (Structure Araka Pay)
    const { status, transactionId, transactionReference, amount } = body;
    const ref = transactionId || transactionReference;

    // 2. Vérifier si le paiement a réussi
    if (status === 'APPROVED' || status === 'SUCCESSFUL') {
      const { db } = await connectDB();

      // 3. Trouver la transaction en attente (on vérifie par ID ou par Référence)
      const transaction = await db.collection('transactions').findOne({ 
        $or: [
          { transactionId: ref },
          { transactionReference: ref }
        ],
        status: 'PENDING'
      });

      if (!transaction) {
        console.log(`Transaction ${transactionId} non trouvée ou déjà traitée.`);
        return NextResponse.json({ received: true, message: 'Already processed or not found' });
      }

      const donationId = transaction.donationId;

      // 4. Mettre à jour le montant actuel de la donation
      const updateResult = await db.collection('donations').updateOne(
        { _id: new ObjectId(donationId) },
        { 
          $inc: { currentAmount: parseFloat(amount || transaction.amount) },
          $set: { updatedAt: new Date() }
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(`Donation ${donationId} mise à jour avec +${amount || transaction.amount}`);
        
        // 5. Mettre à jour le statut de la transaction
        await db.collection('transactions').updateOne(
          { _id: transaction._id },
          { 
            $set: { 
              status: 'SUCCESS',
              updatedAt: new Date(),
              rawCallback: body 
            }
          }
        );
      }
    } else if (status === 'DECLINED' || status === 'CANCELLED') {
      const { db } = await connectDB();
      await db.collection('transactions').updateOne(
        { transactionId: transactionId },
        { $set: { status: status, updatedAt: new Date() } }
      );
    }

    // Toujours répondre à Araka pour confirmer la réception du webhook
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Erreur Webhook Araka:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
