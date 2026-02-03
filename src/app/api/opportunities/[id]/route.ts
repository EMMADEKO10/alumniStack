import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Vérifier si l'ID est valide
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID d\'opportunité invalide' }, { status: 400 });
    }

    const { db } = await connectDB();
    const opportunity = await db.collection('opportunities').findOne({ _id: new ObjectId(id) });
    
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunité non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'opportunité' }, { status: 500 });
  }
} 