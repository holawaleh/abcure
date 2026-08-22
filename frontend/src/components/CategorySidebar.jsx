import { useEffect, useState } from "react";
import api from "../api/client";

function CategorySidebar({ activeCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories/")
      .then((res) => setCategories(res.data.results || res.data))
      .catch(() => setCategories([]));
  }, []);

  const traditionLabel = {
    herbal: "Herbal",
    christian: "Christian",
    islamic: "Islamic",
    general: "General",
  };

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="bg-white rounded-xl shadow-sm p-4 lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Categories</h2>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onCategoryChange("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === ""
                  ? "bg-brand-dark text-white"
                  : "text-gray-600 hover:bg-brand-cream"
              }`}
            >
              All products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  activeCategory === cat.slug
                    ? "bg-brand-dark text-white"
                    : "text-gray-600 hover:bg-brand-cream"
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-xs ${activeCategory === cat.slug ? "text-white/70" : "text-gray-400"}`}>
                  {traditionLabel[cat.tradition] || ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default CategorySidebar;
