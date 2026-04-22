import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // In production, you'd upload to AWS S3, Cloudinary, or similar
    // For now, we'll store as data URL (not recommended for production)
    // If you want to use Cloudinary, uncomment the section below:

    /*
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'venturo-products',
      resource_type: 'auto',
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
    */

    // For now, return the base64 data URL
    return NextResponse.json({
      url: dataUrl,
      message: 'Note: In production, images should be stored on a CDN like Cloudinary or S3',
    });
  } catch (err) {
    console.error('Failed to upload image:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
