import { useEffect, useState } from 'react';
import Products from './Products';
import Customers from './Customers';
import Cart from './Cart';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5198/api';

interface Product {
  id: number;
  name: string;
  price: number;
}
interface Customer {
  id: number;
  name: string;
}
interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  customerId: number;
  customerName: string;
  quantity: number;
  price: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchCart();
    setLoading(false);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/Products`);
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      setError('Nem sikerült betölteni a termékeket.');
    }
  };
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/Customers`);
      if (!res.ok) throw new Error();
      setCustomers(await res.json());
    } catch {
      setError('Nem sikerült betölteni a vásárlókat.');
    }
  };
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/Cart`);
      if (!res.ok) throw new Error();
      setCart(await res.json());
    } catch {
      setError('Nem sikerült betölteni a kosarat.');
    }
  };

  return (
    <div className="container">
      <h1>Webshop</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Betöltés...</p>}
      <Products products={products} setProducts={setProducts} setError={setError} API_URL={API_URL} />
      <Customers customers={customers} setCustomers={setCustomers} setError={setError} API_URL={API_URL} />
      <Cart cart={cart} />
    </div>
  );
}

export default App;
