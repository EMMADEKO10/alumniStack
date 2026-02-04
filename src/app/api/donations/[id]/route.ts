import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const donation = await db.collection('donations').findOne({ _id: new ObjectId(id) });
    
    if (!donation) {
      return NextResponse.json({ error: 'Donation non trouvée' }, { status: 404 });
    }

    // Récupérer les contributeurs (transactions réussies)
    const contributors = await db.collection('transactions')
      .find({ 
        donationId: id, 
        status: 'SUCCESS' 
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Appliquer l'anonymat
    const sanitizedContributors = contributors.map(c => {
      const isOwner = session?.user?.email && c.customerEmail === session.user.email;
      return {
        _id: c._id,
        amount: c.amount,
        createdAt: c.createdAt,
        customerName: isOwner ? c.customerName : 'Contributeur Anonyme',
        isMe: isOwner
      };
    });
    
    return NextResponse.json({
      ...donation,
      contributors: sanitizedContributors
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la donation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la donation' },
      { status: 500 }
    );
  }
}
