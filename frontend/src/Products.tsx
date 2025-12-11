import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductsProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  setError: (msg: string) => void;
  API_URL: string;
}

export default function Products({ products, setProducts, setError, API_URL }: ProductsProps) {
  const [newProduct, setNewProduct] = useState<{ name: string; price: string }>({ name: '', price: '' });
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/Products`);
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      setError('Nem sikerült betölteni a termékeket.');
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/Products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProduct.name, price: Number(newProduct.price) })
      });
      if (!res.ok) throw new Error();
      setNewProduct({ name: '', price: '' });
      fetchProducts();
    } catch {
      setError('Nem sikerült létrehozni a terméket.');
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const res = await fetch(`${API_URL}/Products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editProduct.id, name: editProduct.name, price: Number(editProduct.price) })
      });
      if (!res.ok) throw new Error();
      setEditProduct(null);
      fetchProducts();
    } catch {
      setError('Nem sikerült módosítani a terméket.');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm('Biztosan törlöd a terméket?')) return;
    try {
      const res = await fetch(`${API_URL}/Products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      fetchProducts();
    } catch {
      setError('Nem sikerült törölni a terméket.');
    }
  };

  return (
    <section>
      <h2>Termékek</h2>
      <form onSubmit={createProduct} style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Név"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Ár"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
        <button type="submit">Hozzáadás</button>
      </form>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {editProduct && editProduct.id === p.id ? (
              <form onSubmit={updateProduct} style={{ display: 'inline' }}>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  required
                />
                <button type="submit">Mentés</button>
                <button type="button" onClick={() => setEditProduct(null)}>Mégse</button>
              </form>
            ) : (
              <>
                <b>{p.name}</b> - {p.price} Ft
                <button onClick={() => setEditProduct({ ...p })}>Szerkeszt</button>
                <button onClick={() => deleteProduct(p.id)}>Törlés</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
