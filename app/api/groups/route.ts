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

    const result = await query(
      `SELECT g.* FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY g.updated_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({ groups: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error('Get groups error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch groups' },
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

    const { name, description, avatarUrl } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO groups (name, description, avatar_url, creator_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, avatar_url, creator_id, created_at`,
      [name, description || null, avatarUrl || null, decoded.userId]
    );

    const groupId = result.rows[0].id;

    // Add creator as admin
    await query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [groupId, decoded.userId]
    );

    return NextResponse.json({ group: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create group error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create group' },
      { status: 500 }
    );
  }
}
