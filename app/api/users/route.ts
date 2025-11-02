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
    const search = searchParams.get('search');

    let query_text = 'SELECT id, username, email, avatar_url, bio, status FROM users WHERE id != $1';
    let params: any[] = [decoded.userId];

    if (search) {
      query_text += ' AND (username ILIKE $2 OR email ILIKE $2)';
      params.push(`%${search}%`);
    }

    query_text += ' LIMIT 50';

    const result = await query(query_text, params);

    return NextResponse.json({ users: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const { bio, avatarUrl, status } = await request.json();

    const result = await query(
      `UPDATE users SET bio = COALESCE($1, bio), avatar_url = COALESCE($2, avatar_url), status = COALESCE($3, status), updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, username, email, avatar_url, bio, status`,
      [bio || null, avatarUrl || null, status || null, decoded.userId]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
