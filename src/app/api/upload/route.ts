import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general'; // events, opportunities, ou general

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Déterminer le dossier selon le type
    let folder = 'alumni/general';
    switch (type) {
      case 'events':
        folder = 'alumni/events';
        break;
      case 'opportunities':
        folder = 'alumni/opportunities';
        break;
      case 'formations':
        folder = 'alumni/formations';
        break;
      case 'community':
        folder = 'alumni/community';
        break;
      case 'donations':
        folder = 'alumni/donations';
        break;
      case 'profile':
        folder = 'alumni/profiles';
        break;
      default:
        folder = 'alumni/general';
    }

    // Upload vers Cloudinary
    const uploadResponse = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          transformation: type === 'profile' ? [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' }, // Photo de profil carrée centrée sur le visage
            { quality: 'auto', fetch_format: 'auto' }
          ] : [
            { width: 800, height: 600, crop: 'limit' }, // Redimensionner l'image
            { quality: 'auto' } // Optimisation automatique
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else if (result && result.secure_url && result.public_id) {
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          } else {
            reject(new Error('Upload failed: Invalid result'));
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      folder: folder
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload de l\'image' 
    }, { status: 500 });
  }
} 