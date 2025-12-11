interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  customerId: number;
  customerName: string;
  quantity: number;
  price: number;
}

interface CartProps {
  cart: CartItem[];
}

export default function Cart({ cart }: CartProps) {
  return (
    <section>
      <h2>Kosár</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.cartItemId}>
            {item.productName} ({item.quantity} db) - {item.price} Ft/db, vásárló: {item.customerName}
          </li>
        ))}
      </ul>
    </section>
  );
}
