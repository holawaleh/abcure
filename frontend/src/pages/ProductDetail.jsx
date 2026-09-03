import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import Navbar from "../components/Navbar";

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center py-12 text-gray-400">Loading...</p>;
  if (error) return <p className="text-center py-12 text-red-500">Could not load this product.</p>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/" className="text-sm text-brand hover:underline">Back to shop</Link>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden group">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].image}
                alt={product.images[0].alt_text}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-brand-light">No image yet</span>
            )}
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-brand font-medium">
              {product.category && product.category.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            {product.strapline && (
              <p className="text-gray-500 mt-1">{product.strapline}</p>
            )}
            <p className="text-2xl font-bold text-brand-dark mt-4">
              {"\u20A6"}{product.price_naira.toLocaleString()}
            </p>

            {product.nafdac_number && (
              <span className="inline-block mt-2 text-xs bg-brand-cream text-brand-dark px-2 py-1 rounded-full">
                NAFDAC {product.nafdac_number}
              </span>
            )}

            <p className="text-gray-700 mt-4 whitespace-pre-line">{product.description}</p>

            {product.supports && (
              <Section title="Supports">{product.supports}</Section>
            )}
            {product.ingredients && (
              <Section title="Ingredients">{product.ingredients}</Section>
            )}
            {product.how_to_use && (
              <Section title="How to use">{product.how_to_use}</Section>
            )}
            {product.precautions && (
              <Section title="Precautions">{product.precautions}</Section>
            )}
            {product.storage && (
              <Section title="Storage">{product.storage}</Section>
            )}

            <button className="w-full mt-6 bg-brand-dark text-white py-3 rounded-lg font-medium hover:bg-brand transition-colors">
              Add to cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{children}</p>
    </div>
  );
}

export default ProductDetail;
