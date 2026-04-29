import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { PackagePlus, Pencil, SlidersHorizontal, Trash2 } from "lucide-react";
import DataTable from "../components/DataTable";
import PageLayout from "../components/PageLayout";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";

const columns = [
  { key: "productName", label: "Product", className: "lg:col-span-4" },
  { key: "serialNumber", label: "Serial Number", className: "lg:col-span-2" },
  { key: "category", label: "Category", className: "lg:col-span-2" },
  { key: "status", label: "Status", className: "lg:col-span-2" },
  { key: "actions", label: "Actions", className: "lg:col-span-2" },
];

function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [form, setForm] = useState({
    productName: "",
    category: "",
    status: "AVAILABLE",
  });
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const formSectionRef = useRef(null);

  const serialNumberPreview = useMemo(() => {
    if (editingProductId) {
      return products.find((product) => product.id === editingProductId)?.serialNumber || "";
    }

    const normalized = (form.category || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    const prefix = (normalized.length >= 3 ? normalized.slice(0, 3) : `${normalized}PRD`.slice(0, 3)) || "PRD";

    let counter = 1;
    let candidate = `${prefix}-${String(counter).padStart(3, "0")}`;
    const existingSerials = new Set(products.map((product) => product.serialNumber?.toUpperCase()));

    while (existingSerials.has(candidate.toUpperCase())) {
      counter += 1;
      candidate = `${prefix}-${String(counter).padStart(3, "0")}`;
    }

    return candidate;
  }, [editingProductId, form.category, products]);

  const filteredProducts = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        [product.productName, product.serialNumber, product.category, product.status, product.id]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus = statusFilter === "ALL" || product.status?.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deferredSearchTerm, products, statusFilter]);

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await api.get("/products");
      setProducts(unwrapApiResponse(response) || []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load products"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, {
          ...form,
          serialNumber: serialNumberPreview,
        });
        setSuccessMessage("Product updated successfully.");
      } else {
        await api.post("/products", {
          ...form,
          serialNumber: serialNumberPreview,
        });
        setSuccessMessage("Product created successfully. Serial number was generated automatically.");
      }
      setForm({
        productName: "",
        category: "",
        status: "AVAILABLE",
      });
      setEditingProductId("");
      await loadProducts();
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          editingProductId ? "Unable to update product" : "Unable to create product",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddProductClick() {
    setEditingProductId("");
    setForm({
      productName: "",
      category: "",
      status: "AVAILABLE",
    });
    setError("");
    setSuccessMessage("");
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleEditProduct(product) {
    setEditingProductId(product.id);
    setForm({
      productName: product.productName || "",
      category: product.category || "",
      status: product.status || "AVAILABLE",
    });
    setError("");
    setSuccessMessage("");
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(`Delete product "${product.productName}"?`);
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await api.delete(`/products/${product.id}`);
      if (editingProductId === product.id) {
        setEditingProductId("");
        setForm({
          productName: "",
          category: "",
          status: "AVAILABLE",
        });
      }
      setSuccessMessage("Product deleted successfully.");
      await loadProducts();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to delete product"));
    }
  }

  function handleFilterClick() {
    setStatusFilter((current) => {
      if (current === "ALL") return "AVAILABLE";
      if (current === "AVAILABLE") return "ASSIGNED";
      return "ALL";
    });
  }

  return (
    <PageLayout
      title="Product Management"
      subtitle="Monitor inventory levels, availability, and product condition across your workspace."
      searchValue={searchTerm}
      searchPlaceholder="Search products by name, serial, category..."
      onSearchChange={setSearchTerm}
      onNotificationsClick={() => setSuccessMessage("Product inventory notifications are up to date.")}
      action={
        <button type="button" className="btn-primary w-full sm:w-auto" onClick={handleAddProductClick}>
          <PackagePlus size={18} className="mr-2" />
          Add Product
        </button>
      }
    >
      {error ? <div className="mb-6 rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div> : null}
      {successMessage ? (
        <div className="mb-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <div className="grid gap-6">
        <SectionCard
          title="Inventory Catalog"
          description={`${filteredProducts.length} product record(s) shown.`}
          action={
            <button type="button" className="btn-secondary w-full sm:w-auto" onClick={handleFilterClick}>
              <SlidersHorizontal size={18} className="mr-2" />
              Filter: {statusFilter === "ALL" ? "All" : statusFilter === "AVAILABLE" ? "Available" : "Assigned"}
            </button>
          }
        >
          {loading ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">No products found.</div>
          ) : (
            <DataTable
              columns={columns}
              rows={filteredProducts}
              keyField="id"
              renderCell={(row, key) => {
                if (key === "productName") {
                  return (
                    <div className="min-w-0">
                      <p className="break-words text-base font-semibold leading-7 text-ink-900">{row.productName}</p>
                      <p className="break-all text-sm text-slate-500">{row.id}</p>
                    </div>
                  );
                }

                if (key === "serialNumber") {
                  return <p className="break-all text-sm leading-6 text-slate-600">{row.serialNumber}</p>;
                }

                if (key === "status") {
                  return <StatusBadge value={row.status} />;
                }

                if (key === "actions") {
                  return (
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(row)}
                        className="btn-secondary px-3 py-2 text-xs"
                      >
                        <Pencil size={14} className="mr-1.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(row)}
                        className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
                      >
                        <Trash2 size={14} className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  );
                }

                return <p className="text-sm text-slate-600">{row[key]}</p>;
              }}
            />
          )}
        </SectionCard>

        <SectionCard
          title={editingProductId ? "Edit Product" : "New Product Entry"}
          description={
            editingProductId
              ? "Update the selected product. Its serial number stays unique and unchanged."
              : "Add a product and let the backend generate a unique serial number automatically."
          }
        >
          <form ref={formSectionRef} className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 px-4 py-3 text-sm text-brand-800">
                Serial number will be generated automatically when you save the product.
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Serial Number</label>
              <input
                className="field bg-slate-50 text-slate-500"
                value={serialNumberPreview}
                readOnly
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Product name</label>
              <input
                className="field"
                placeholder="MacBook Pro 14"
                value={form.productName}
                onChange={(event) => setForm((current) => ({ ...current, productName: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
              <input
                className="field"
                placeholder="Laptop"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
              <select
                className="field"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="AVAILABLE">Available</option>
                <option value="ASSIGNED">Assigned</option>
              </select>
            </div>
            <div className="lg:col-span-2 flex items-end">
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary w-full lg:w-auto" disabled={submitting}>
                  {submitting
                    ? editingProductId
                      ? "Updating..."
                      : "Saving..."
                    : editingProductId
                      ? "Update Product"
                      : "Save Product"}
                </button>
                {editingProductId ? (
                  <button
                    type="button"
                    className="btn-secondary w-full lg:w-auto"
                    onClick={handleAddProductClick}
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageLayout>
  );
}

export default ProductManagementPage;
