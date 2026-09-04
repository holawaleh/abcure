import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/errors";
import Navbar from "../components/Navbar";

const FORM_CHOICES = ["soap", "oil", "powder", "capsule", "tea", "cream", "liquid", "other"];
const SIZE_UNITS = ["g", "kg", "ml", "l", "piece"];

const emptyProduct = {
  name: "", category: "", strapline: "", form: "soap",
  size_value: "", size_unit: "g", brief: "", description: "",
  supports: "", ingredients: "", how_to_use: "", precautions: "",
  storage: "", origin: "", method_note: "", sku: "",
  price_kobo: "", stock: 0, low_stock_threshold: 5,
  nafdac_number: "", is_published: false, is_featured: false,
};

function AdminDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [saving, setSaving] = useState(false);

  function loadProducts() {
    api.get("/admin/products/").then((res) => setProducts(res.data.results || res.data));
  }

  function loadImages(productId) {
    return api.get(`/admin/product-images/?product=${productId}`)
      .then((res) => setImages(res.data.results || res.data))
      .catch((err) => {
        setMessage(getErrorMessage(err));
        setMessageType("error");
      });
  }

  useEffect(() => {
    loadProducts();
    api.get("/admin/categories/").then((res) => setCategories(res.data.results || res.data));
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      ...emptyProduct,
      ...product,
      category: product.category?.id || product.category || "",
    });
    setImages(product.images || []);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyProduct);
    setImages([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      size_value: parseFloat(form.size_value),
      price_kobo: parseInt(form.price_kobo, 10),
      stock: parseInt(form.stock, 10),
      low_stock_threshold: parseInt(form.low_stock_threshold, 10),
      category: form.category ? parseInt(form.category, 10) : null,
    };
    try {
      if (editingId) {
        await api.patch(`/admin/products/${editingId}/`, payload);
        setMessage("Product updated.");
      } else {
        const res = await api.post("/admin/products/", payload);
        setMessage("Product created. Add photos below.");
        setEditingId(res.data.id);
        setForm({
          ...emptyProduct,
          ...res.data,
          category: res.data.category?.id || res.data.category || "",
        });
        setImages(res.data.images || []);
      }
      setMessageType("success");
      loadProducts();
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/products/${id}/`);
      loadProducts();
      if (editingId === id) resetForm();
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType("error");
    }
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingId) return;
    setUploadingImages(true);
    setMessage(null);
    try {
      let nextOrder = images.length;
      for (const file of files) {
        const data = new FormData();
        data.append("product", editingId);
        data.append("image", file);
        data.append("alt_text", form.name || "Product image");
        data.append("order", nextOrder++);
        await api.post("/admin/product-images/", data);
      }
      await loadImages(editingId);
      setMessage("Image(s) uploaded.");
      setMessageType("success");
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType("error");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }

  function handleImageFieldChange(id, field, value) {
    setImages((imgs) => imgs.map((img) => (img.id === id ? { ...img, [field]: value } : img)));
  }

  async function handleImageSave(image) {
    try {
      await api.patch(`/admin/product-images/${image.id}/`, {
        alt_text: image.alt_text,
        order: parseInt(image.order, 10) || 0,
      });
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType("error");
    }
  }

  async function handleImageDelete(id) {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/admin/product-images/${id}/`);
      setImages((imgs) => imgs.filter((img) => img.id !== id));
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType("error");
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">
            {editingId ? "Edit product" : "Add a new product"}
          </h2>

          {message && (
            <p className={`text-xs rounded-lg px-3 py-2 break-all ${
              messageType === "error" ? "bg-red-50 text-red-600" : "bg-brand-cream text-brand-dark"
            }`}>
              {message}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange} required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.tradition})</option>
                ))}
              </select>
            </div>
            <Field label="Strapline" name="strapline" value={form.strapline} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
              <select name="form" value={form.form} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                {FORM_CHOICES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <Field label="Size value" name="size_value" type="number" step="0.01" value={form.size_value} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size unit</label>
              <select name="size_unit" value={form.size_unit} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                {SIZE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <Field label="SKU" name="sku" value={form.sku} onChange={handleChange} required />
            <Field label="Price (kobo)" name="price_kobo" type="number" value={form.price_kobo} onChange={handleChange} required />
            <Field label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <Field label="Low stock threshold" name="low_stock_threshold" type="number" value={form.low_stock_threshold} onChange={handleChange} />
            <Field label="NAFDAC number" name="nafdac_number" value={form.nafdac_number} onChange={handleChange} />
          </div>

          <Field label="Brief (max 140 chars)" name="brief" value={form.brief} onChange={handleChange} required maxLength={140} />
          <TextArea label="Description" name="description" value={form.description} onChange={handleChange} required />
          <Field label="Supports" name="supports" value={form.supports} onChange={handleChange} />
          <TextArea label="Ingredients" name="ingredients" value={form.ingredients} onChange={handleChange} required />
          <TextArea label="How to use" name="how_to_use" value={form.how_to_use} onChange={handleChange} required />
          <TextArea label="Precautions" name="precautions" value={form.precautions} onChange={handleChange} required />
          <Field label="Storage" name="storage" value={form.storage} onChange={handleChange} />
          <Field label="Origin" name="origin" value={form.origin} onChange={handleChange} />
          <Field label="Method note" name="method_note" value={form.method_note} onChange={handleChange} />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
              Featured
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700">
                Done \u2014 start a new product
              </button>
            )}
          </div>
        </form>

        {editingId && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Images</h2>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-gray-100 rounded-lg p-2 space-y-2">
                    <img src={img.image} alt={img.alt_text} className="w-full h-24 object-cover rounded" />
                    <input
                      type="text"
                      value={img.alt_text}
                      onChange={(e) => handleImageFieldChange(img.id, "alt_text", e.target.value)}
                      onBlur={() => handleImageSave(img)}
                      placeholder="Alt text"
                      className="w-full px-2 py-1 rounded border border-gray-200 text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={img.order}
                        onChange={(e) => handleImageFieldChange(img.id, "order", e.target.value)}
                        onBlur={() => handleImageSave(img)}
                        className="w-16 px-2 py-1 rounded border border-gray-200 text-xs"
                      />
                      <button type="button" onClick={() => handleImageDelete(img.id)}
                        className="text-xs text-red-500 hover:underline ml-auto">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add images</label>
              <input
                type="file" accept="image/*" multiple
                onChange={handleImageUpload}
                disabled={uploadingImages}
                className="text-sm"
              />
              {uploadingImages && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h2 className="font-semibold text-gray-900 p-6 pb-0">All products</h2>
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="px-6 py-2">Image</th>
                <th className="px-6 py-2">Name</th>
                <th className="px-6 py-2">Price</th>
                <th className="px-6 py-2">Stock</th>
                <th className="px-6 py-2">Published</th>
                <th className="px-6 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="px-6 py-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0].image} alt="" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-300">\u2014</span>
                    )}
                  </td>
                  <td className="px-6 py-3">{p.name}</td>
                  <td className="px-6 py-3">{"\u20A6"}{(p.price_kobo / 100).toLocaleString()}</td>
                  <td className="px-6 py-3">{p.stock}</td>
                  <td className="px-6 py-3">{p.is_published ? "Yes" : "No"}</td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <button onClick={() => startEdit(p)} className="text-brand hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input {...props} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea {...props} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
    </div>
  );
}

export default AdminDashboard;
