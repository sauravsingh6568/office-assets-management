import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, ScanSearch } from "lucide-react";
import PageLayout from "../components/PageLayout";
import SectionCard from "../components/SectionCard";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";

function AssignProductPage() {
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    employeeId: "",
    productId: "",
    assignedDate: new Date().toISOString().slice(0, 10),
    returnDate: "",
  });

  const availableProducts = useMemo(
    () => products.filter((product) => product.status?.toUpperCase() !== "ASSIGNED"),
    [products],
  );

  useEffect(() => {
    async function loadFormData() {
      setLoading(true);

      try {
        const [employeesResponse, productsResponse] = await Promise.all([
          api.get("/employees"),
          api.get("/products"),
        ]);

        const employeeList = unwrapApiResponse(employeesResponse) || [];
        const productList = unwrapApiResponse(productsResponse) || [];

        setEmployees(employeeList);
        setProducts(productList);
        setForm((current) => ({
          ...current,
          employeeId: current.employeeId || employeeList[0]?.id || "",
          productId:
            current.productId ||
            productList.find((product) => product.status?.toUpperCase() !== "ASSIGNED")?.id ||
            "",
        }));
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Unable to load assignment form data"));
      } finally {
        setLoading(false);
      }
    }

    loadFormData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/assignments", {
        ...form,
        returnDate: form.returnDate || null,
      });

      setSuccessMessage("Product assigned successfully.");
      const productsResponse = await api.get("/products");
      const refreshedProducts = unwrapApiResponse(productsResponse) || [];
      setProducts(refreshedProducts);
      setForm((current) => ({
        ...current,
        productId: refreshedProducts.find((product) => product.status?.toUpperCase() !== "ASSIGNED")?.id || "",
        returnDate: "",
      }));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to assign product"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Assign Product"
      subtitle="Create structured product handovers with employee selection, asset details, and return expectations."
      action={
        <button type="button" className="btn-primary">
          <ClipboardCheck size={18} className="mr-2" />
          Review Assignments
        </button>
      }
    >
      {error ? <div className="mb-6 rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div> : null}
      {successMessage ? (
        <div className="mb-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Assignment Checklist" description="A quick operational guide before confirming handover.">
          <div className="space-y-4">
            {[
              "Verify employee record and department approval.",
              "Confirm product serial number and condition before handoff.",
              "Capture expected return date for temporary allocations.",
              "Notify employee and manager after successful assignment.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-3xl bg-white p-4">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Assign a Product" description="Create a live assignment using the Spring Boot API.">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Employee</label>
              <select
                className="field"
                value={form.employeeId}
                onChange={(event) => setForm((current) => ({ ...current, employeeId: event.target.value }))}
                disabled={loading || employees.length === 0}
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.department})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Product</label>
              <select
                className="field"
                value={form.productId}
                onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
                disabled={loading || availableProducts.length === 0}
              >
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName} ({product.serialNumber})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Assign date</label>
              <input
                className="field"
                type="date"
                value={form.assignedDate}
                onChange={(event) => setForm((current) => ({ ...current, assignedDate: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Return date</label>
              <input
                className="field"
                type="date"
                value={form.returnDate}
                onChange={(event) => setForm((current) => ({ ...current, returnDate: event.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={submitting || loading || !form.employeeId || !form.productId}
              >
                {submitting ? "Confirming..." : "Confirm Assignment"}
              </button>
              <button type="button" className="btn-secondary flex-1">
                <ScanSearch size={18} className="mr-2" />
                {availableProducts.length} Available Products
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageLayout>
  );
}

export default AssignProductPage;
