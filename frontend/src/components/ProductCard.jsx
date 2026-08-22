import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="aspect-square bg-brand-cream flex items-center justify-center overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-brand-light text-sm">No image yet</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-wide text-brand font-medium">
          {product.category && product.category.name}
        </span>
        <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{product.brief}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-brand-dark">{"\u20A6"}{product.price_naira.toLocaleString()}</span>
          <Link
            to={`/products/${product.slug}`}
            className="bg-brand-dark text-white text-sm px-3 py-1.5 rounded-lg hover:bg-brand transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
