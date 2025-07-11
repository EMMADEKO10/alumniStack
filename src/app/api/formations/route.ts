import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledAt: Date;
}

interface Formation {
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  price: number;
  startDate: Date | null;
  endDate: Date | null;
  location?: string;
  maxStudents?: number | null;
  syllabus?: string[];
  imageUrl?: string;
  students: Student[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const { db } = await connectDB();
    const formations = await db.collection('formations').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(formations);
  } catch (error) {
    console.error('Error fetching formations:', error);
    return NextResponse.json({ error: 'Failed to fetch formations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, duration, level, instructor, price, startDate, endDate, location, maxStudents, syllabus, imageUrl } = body;

    if (!title || !description || !duration || !level || !instructor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectDB();

    const newFormation: Formation = {
      title,
      description,
      duration,
      level,
      instructor,
      price: price || 0,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      location,
      maxStudents: maxStudents || null,
      syllabus: syllabus || [],
      imageUrl: imageUrl || '',
      students: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('formations').insertOne(newFormation);
    const createdFormation = await db.collection('formations').findOne({ _id: result.insertedId });

    return NextResponse.json(createdFormation, { status: 201 });
  } catch (error) {
    console.error('Error creating formation:', error);
    return NextResponse.json({ error: 'Failed to create formation' }, { status: 500 });
  }
} 