'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // State Form Input
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState<number | ''>('');

  // Fetch Data Produk dari API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit Handler (Simpan Produk)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || harga === '') return;

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, deskripsi, harga: Number(harga) }),
      });

      if (res.ok) {
        setNama('');
        setDeskripsi('');
        setHarga('');
        fetchProducts();
      }
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
    }
  };

  // Kalkulasi Stats Card
  const totalItem = products.length;
  const totalValuasi = products.reduce((acc, curr) => acc + Number(curr.harga), 0);
  const rataRataHarga = totalItem > 0 ? totalValuasi / totalItem : 0;

  // Filter Search
  const filteredProducts = products.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen font-sans text-slate-100 bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden flex flex-col md:flex-row"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop')`,
      }}
    >
      {/* CSS Animation untuk Daun Berjatuhan */}
      <style jsx global>{`
        @keyframes fallingLeaves {
          0% {
            opacity: 1;
            top: -10%;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            opacity: 0.2;
            top: 110%;
            transform: translateX(120px) rotate(360deg);
          }
        }
        .leaf {
          position: absolute;
          width: 24px;
          height: 24px;
          pointer-events: none;
          z-index: 5;
          animation: fallingLeaves 10s linear infinite;
        }
        .leaf:nth-child(1) { left: 10%; animation-duration: 8s; animation-delay: 0s; }
        .leaf:nth-child(2) { left: 25%; animation-duration: 12s; animation-delay: 2s; }
        .leaf:nth-child(3) { left: 40%; animation-duration: 9s; animation-delay: 4s; }
        .leaf:nth-child(4) { left: 60%; animation-duration: 11s; animation-delay: 1s; }
        .leaf:nth-child(5) { left: 75%; animation-duration: 7s; animation-delay: 3s; }
        .leaf:nth-child(6) { left: 90%; animation-duration: 10s; animation-delay: 5s; }
      `}</style>

      {/* Elemen Daun Berjatuhan */}
      <div className="leaf">🍃</div>
      <div className="leaf">🌿</div>
      <div className="leaf">🍃</div>
      <div className="leaf">🍃</div>
      <div className="leaf">🌿</div>
      <div className="leaf">🍃</div>

      {/* Overlay Gelap Transparan Hutan/Daun */}
      <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[2px] pointer-events-none" />

      {/* SIDEBAR KIRI: Brand & Form Input */}
      <aside className="relative z-10 w-full md:w-80 lg:w-96 p-6 md:p-8 border-b md:border-b-0 md:border-r border-emerald-700/40 bg-emerald-950/60 backdrop-blur-xl flex flex-col justify-between shrink-0 shadow-2xl">
        <div>
          {/* Header Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold flex items-center gap-2 text-white">
              Vanderel{' '}
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-400/30">
                LEAF V2.0
              </span>
            </h1>
            <p className="text-xs text-emerald-200/80 mt-1 font-medium">
              Sistem Manajemen Inventaris Hutan
            </p>
          </div>

          {/* Form Tambah Produk */}
          <div className="bg-emerald-900/40 p-5 rounded-2xl border border-emerald-700/50 shadow-inner">
            <h2 className="text-sm font-bold text-emerald-200 mb-4 flex items-center gap-2">
              <span className="text-emerald-400">🌿</span> Tambah Produk Baru
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1.5">
                  NAMA PRODUK
                </label>
                <input
                  type="text"
                  placeholder="Cth: Bibit Tanaman"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-2.5 text-xs text-slate-100 placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1.5">
                  DESKRIPSI
                </label>
                <textarea
                  placeholder="Keterangan spesifikasi..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-2.5 text-xs text-slate-100 placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1.5">
                  HARGA (RP)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-2.5 text-xs text-slate-100 placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2.5 rounded-xl text-xs mt-2 transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Menyimpan...' : '+ Simpan Produk'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-6 pt-4 border-t border-emerald-700/30 text-[11px] text-emerald-300/80 flex items-center justify-between font-medium">
          <span>Eco Database Connected</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </aside>

      {/* AREA UTAMA KANAN: Statistik + Search + Tabel */}
      <main className="relative z-10 flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-950/50 backdrop-blur-lg p-5 rounded-2xl border border-emerald-700/50 shadow-lg">
            <p className="text-[11px] text-emerald-300 uppercase font-bold tracking-wider">TOTAL ITEM</p>
            <p className="text-2xl font-extrabold mt-1 text-white">
              {totalItem} <span className="text-xs font-normal text-emerald-200/70">Produk</span>
            </p>
          </div>

          <div className="bg-emerald-950/50 backdrop-blur-lg p-5 rounded-2xl border border-emerald-700/50 shadow-lg">
            <p className="text-[11px] text-emerald-300 uppercase font-bold tracking-wider">TOTAL VALUASI</p>
            <p className="text-2xl font-extrabold mt-1 text-emerald-400">
              Rp {totalValuasi.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-emerald-950/50 backdrop-blur-lg p-5 rounded-2xl border border-emerald-700/50 shadow-lg">
            <p className="text-[11px] text-emerald-300 uppercase font-bold tracking-wider">RATA-RATA HARGA</p>
            <p className="text-2xl font-extrabold mt-1 text-white">
              Rp {Math.round(rataRataHarga).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Pencarian & Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-emerald-950/70 backdrop-blur-md border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
            />
            <span className="absolute left-3 top-2.5 text-emerald-400 text-xs">🔍</span>
          </div>
          <p className="text-xs text-emerald-200/80 whitespace-nowrap font-medium">
            Menampilkan <span className="text-white font-bold">{filteredProducts.length}</span> dari {products.length} item
          </p>
        </div>

        {/* Tabel Data Produk */}
        <div className="bg-emerald-950/70 backdrop-blur-xl rounded-2xl border border-emerald-700/60 shadow-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-900/60 uppercase text-emerald-300 border-b border-emerald-700/60">
              <tr>
                <th className="p-3.5 font-bold">ID / PRODUK</th>
                <th className="p-3.5 font-bold">DESKRIPSI</th>
                <th className="p-3.5 font-bold">HARGA</th>
                <th className="p-3.5 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/40">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-emerald-200/60 font-medium">
                    Belum ada data produk tersimpan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-900/30 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-white text-sm">{item.nama}</p>
                      <p className="text-[10px] text-emerald-300/60">#PRD-{item.id}</p>
                    </td>
                    <td className="p-3.5 text-emerald-100/80 max-w-xs truncate">
                      {item.deskripsi || '-'}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 text-sm">
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-[11px] bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-lg transition-colors font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}