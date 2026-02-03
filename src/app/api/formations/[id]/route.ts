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
      return NextResponse.json({ error: 'ID de formation invalide' }, { status: 400 });
    }

    const { db } = await connectDB();
    const formation = await db.collection('formations').findOne({ _id: new ObjectId(id) });
    
    if (!formation) {
      return NextResponse.json({ error: 'Formation non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json(formation);
  } catch (error) {
    console.error('Error fetching formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de la formation' }, { status: 500 });
  }
} 