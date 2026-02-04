import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Vérifier si l'ID est valide
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID d\'événement invalide' }, { status: 400 });
    }

    const { db } = await connectDB();
    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    
    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'événement' }, { status: 500 });
  }
} 