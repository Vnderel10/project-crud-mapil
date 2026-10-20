import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Ambil semua data produk
export async function GET() {
  try {
    // Mengubah nama kolom database (name, description, price) 
    // agar sesuai dengan frontend (nama, deskripsi, harga)
    const [rows]: any = await db.query(
      'SELECT id, name AS nama, description AS deskripsi, price AS harga, created_at FROM products ORDER BY id DESC'
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('ERROR GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah produk baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, deskripsi, harga } = body;

    if (!nama || harga === undefined) {
      return NextResponse.json(
        { error: 'Nama dan Harga wajib diisi' },
        { status: 400 }
      );
    }

    // Memasukkan data ke kolom database yang sudah ada
    const [result]: any = await db.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [nama, deskripsi || '', Number(harga)]
    );

    return NextResponse.json(
      { id: result.insertId, nama, deskripsi, harga },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('ERROR POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}