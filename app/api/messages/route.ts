import { query, initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get('recipientId');

    if (!recipientId) {
      return NextResponse.json({ error: 'Missing recipientId' }, { status: 400 });
    }

    const result = await query(
      `SELECT dm.*, u.username, u.avatar_url FROM direct_messages dm
       JOIN users u ON dm.sender_id = u.id
       WHERE (dm.sender_id = $1 AND dm.recipient_id = $2) 
          OR (dm.sender_id = $2 AND dm.recipient_id = $1)
       ORDER BY dm.created_at ASC LIMIT 100`,
      [decoded.userId, parseInt(recipientId)]
    );

    return NextResponse.json({ messages: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { recipientId, content, mediaUrl } = await request.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO direct_messages (sender_id, recipient_id, content, media_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_id, recipient_id, content, media_url, created_at`,
      [decoded.userId, recipientId, content, mediaUrl || null]
    );

    return NextResponse.json({ message: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
