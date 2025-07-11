import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Donation {
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Récupérer toutes les actions de donation
export async function GET() {
  try {
    const { db } = await connectDB();
    const donations = await db.collection('donations').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(donations);
  } catch (error) {
    console.error('Erreur lors de la récupération des donations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des donations' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle action de donation
export async function POST(request: Request) {
  try {
    const { db } = await connectDB();
    const body = await request.json();
    
    // Validation des données
    const { title, description, image, targetAmount, currentAmount } = body;
    
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Le titre et la description sont requis' },
        { status: 400 }
      );
    }

    const newDonation: Donation = {
      title: title.trim(),
      description: description.trim(),
      image: image || '/graduation.jpg',
      targetAmount: parseFloat(targetAmount) || 0,
      currentAmount: parseFloat(currentAmount) || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('donations').insertOne(newDonation);
    
    return NextResponse.json(
      { message: 'Action de donation créée avec succès', donationId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création de l\'action de donation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'action de donation' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une action de donation
export async function PUT(request: Request) {
  try {
    const { db } = await connectDB();
    const body = await request.json();
    const { id, title, description, image, targetAmount, currentAmount, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'action de donation requis' },
        { status: 400 }
      );
    }

    const updateData: Partial<Donation> = {
      title: title?.trim(),
      description: description?.trim(),
      image: image || '/graduation.jpg',
      targetAmount: parseFloat(targetAmount) || 0,
      currentAmount: parseFloat(currentAmount) || 0,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    // Supprimer les champs undefined
    Object.keys(updateData).forEach(key => 
      updateData[key as keyof Donation] === undefined && delete updateData[key as keyof Donation]
    );

    const result = await db.collection('donations').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Action de donation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Action de donation mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'action de donation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'action de donation' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une action de donation
export async function DELETE(request: Request) {
  try {
    const { db } = await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'action de donation requis' },
        { status: 400 }
      );
    }

    const result = await db.collection('donations').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Action de donation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Action de donation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'action de donation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'action de donation' },
      { status: 500 }
    );
  }
} 