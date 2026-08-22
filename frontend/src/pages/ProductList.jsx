import { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import PromoBanner from "../components/PromoBanner";
import Pagination from "../components/Pagination";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (category) params.category__slug = category;
    if (searchTerm) params.search = searchTerm;

    api.get("/products/", { params })
      .then((response) => {
        setProducts(response.data.results);
        setHasNext(Boolean(response.data.next));
        setHasPrevious(Boolean(response.data.previous));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, searchTerm, page]);

  useEffect(() => { setPage(1); }, [category, searchTerm]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-brand-dark shrink-0">AB Cure</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <PromoBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          <CategorySidebar activeCategory={category} onCategoryChange={setCategory} />

          <div className="flex-1">
            {loading && <p className="text-center text-gray-400 py-12">Loading products...</p>}
            {error && <p className="text-center text-red-500 py-12">Something went wrong: {error}</p>}
            {!loading && !error && products.length === 0 && (
              <p className="text-center text-gray-400 py-12">No products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductList;
