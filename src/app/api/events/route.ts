import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

interface Event {
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  organizer?: string;
  imageUrl?: string;
  maxParticipants?: number | null;
  participants: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const { db } = await connectDB();
    const events = await db.collection('events')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, location, type, organizer, imageUrl, maxParticipants } = body;

    if (!title || !description || !date || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectDB();

    const newEvent: Event = {
      title,
      description,
      date: new Date(date),
      location,
      type: type || 'general',
      organizer,
      imageUrl,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('events').insertOne(newEvent);
    const createdEvent = await db.collection('events').findOne({ _id: result.insertedId });

    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création de l\'événement: ' + (error as Error).message 
    }, { status: 500 });
  }
} 