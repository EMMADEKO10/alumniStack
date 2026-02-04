import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

interface Story {
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: string;
  featured?: boolean;
  readTime?: string;
  author?: string;
  fullContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const { db } = await connectDB();
    const stories = await db.collection('stories')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, image, category, featured, readTime, author, fullContent } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const { db } = await connectDB();

    const newStory: Story = {
      title,
      description,
      date: date || new Date().toISOString(),
      image,
      category,
      featured: Boolean(featured),
      readTime,
      author,
      fullContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('stories').insertOne(newStory);
    const created = await db.collection('stories').findOne({ _id: result.insertedId });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de l\'histoire' }, { status: 500 });
  }
}


