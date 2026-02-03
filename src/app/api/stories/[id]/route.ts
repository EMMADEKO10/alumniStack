import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID d\'histoire invalide' }, { status: 400 });
    }
    const { db } = await connectDB();
    const story = await db.collection('stories').findOne({ _id: new ObjectId(id) });
    if (!story) {
      return NextResponse.json({ error: 'Histoire non trouvée' }, { status: 404 });
    }
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'histoire' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID d\'histoire invalide' }, { status: 400 });
    }
    const body = await request.json();
    const { title, description, date, image, category, featured, readTime, author, fullContent } = body;

    const { db } = await connectDB();
    const result = await db.collection('stories').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(date !== undefined && { date }),
          ...(image !== undefined && { image }),
          ...(category !== undefined && { category }),
          ...(featured !== undefined && { featured: Boolean(featured) }),
          ...(readTime !== undefined && { readTime }),
          ...(author !== undefined && { author }),
          ...(fullContent !== undefined && { fullContent }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return NextResponse.json({ error: 'Histoire non trouvée' }, { status: 404 });
    }
    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID d\'histoire invalide' }, { status: 400 });
    }
    const { db } = await connectDB();
    const result = await db.collection('stories').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Histoire non trouvée' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}


