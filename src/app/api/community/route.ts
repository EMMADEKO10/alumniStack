import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

interface CommunityPost {
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  likes: unknown[];
  comments: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const { db } = await connectDB();
    const posts = await db.collection('community_posts').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json({ error: 'Failed to fetch community posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author, category, tags, imageUrl } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectDB();
    const post: CommunityPost = {
      title,
      content,
      author,
      category: category || 'general',
      tags: tags || [],
      imageUrl,
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('community_posts').insertOne(post);
    const createdPost = await db.collection('community_posts').findOne({ _id: result.insertedId });

    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json({ error: 'Failed to create community post' }, { status: 500 });
  }
} 
