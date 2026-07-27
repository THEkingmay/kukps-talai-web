import apiClient from "~/configs/axios";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get("/");
        const data = res.data.products;
        setProducts(data);
      } catch (error) {
        setErr(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      products
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
      {err && <p>{err}</p>}
    </div>
  );
}
