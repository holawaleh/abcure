import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

function PromoBanner() {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get("/products/", { params: { is_featured: true, page_size: 8 } })
      .then((res) => {
        const results = res.data.results || [];
        if (results.length > 0) {
          setProducts(shuffle(results));
        } else {
          return api.get("/products/", { params: { page_size: 8 } })
            .then((fallback) => setProducts(shuffle(fallback.data.results || [])));
        }
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [products]);

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  if (products.length === 0) return null;

  const product = products[index];

  return (
    <div className="relative bg-gradient-to-r from-brand-dark to-brand rounded-2xl overflow-hidden mb-6 min-h-[220px] flex items-center">
      <div className="px-6 sm:px-10 py-8 flex-1">
        <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
          Featured
        </span>
        <h2 className="text-white text-2xl sm:text-3xl font-bold max-w-md">
          {product.name}
        </h2>
        <p className="text-white/80 mt-2 max-w-md line-clamp-2">{product.brief}</p>
        <Link
          to={`/products/${product.slug}`}
          className="inline-block mt-5 bg-white text-brand-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-cream transition-colors"
        >
          Shop now
        </Link>
      </div>

      {product.thumbnail && (
        <div className="hidden sm:block w-48 h-48 mr-10 rounded-xl overflow-hidden shrink-0">
          <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === index ? "bg-white w-4" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoBanner;
