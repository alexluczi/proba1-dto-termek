import { useState } from 'react';

interface Customer {
  id: number;
  name: string;
}

interface CustomersProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  setError: (msg: string) => void;
  API_URL: string;
}

export default function Customers({ customers, setCustomers, setError, API_URL }: CustomersProps) {
  const [newCustomer, setNewCustomer] = useState<{ name: string }>({ name: '' });
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/Customers`);
      if (!res.ok) throw new Error();
      setCustomers(await res.json());
    } catch {
      setError('Nem sikerült betölteni a vásárlókat.');
    }
  };

  const createCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/Customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCustomer.name })
      });
      if (!res.ok) throw new Error();
      setNewCustomer({ name: '' });
      fetchCustomers();
    } catch {
      setError('Nem sikerült létrehozni a vásárlót.');
    }
  };

  const updateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    try {
      const res = await fetch(`${API_URL}/Customers/${editCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editCustomer.id, name: editCustomer.name })
      });
      if (!res.ok) throw new Error();
      setEditCustomer(null);
      fetchCustomers();
    } catch {
      setError('Nem sikerült módosítani a vásárlót.');
    }
  };

  const deleteCustomer = async (id: number) => {
    if (!window.confirm('Biztosan törlöd a vásárlót?')) return;
    try {
      const res = await fetch(`${API_URL}/Customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      fetchCustomers();
    } catch {
      setError('Nem sikerült törölni a vásárlót.');
    }
  };

  return (
    <section>
      <h2>Vásárlók</h2>
      <form onSubmit={createCustomer} style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Név"
          value={newCustomer.name}
          onChange={e => setNewCustomer({ name: e.target.value })}
          required
        />
        <button type="submit">Hozzáadás</button>
      </form>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>
            {editCustomer && editCustomer.id === c.id ? (
              <form onSubmit={updateCustomer} style={{ display: 'inline' }}>
                <input
                  type="text"
                  value={editCustomer.name}
                  onChange={e => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  required
                />
                <button type="submit">Mentés</button>
                <button type="button" onClick={() => setEditCustomer(null)}>Mégse</button>
              </form>
            ) : (
              <>
                {c.name}
                <button onClick={() => setEditCustomer({ ...c })}>Szerkeszt</button>
                <button onClick={() => deleteCustomer(c.id)}>Törlés</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
