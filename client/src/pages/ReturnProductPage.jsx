import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, PackageX, RotateCcw, SearchCheck, Undo2 } from "lucide-react";
import DataTable from "../components/DataTable";
import PageLayout from "../components/PageLayout";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";

const columns = [
  { key: "employee", label: "Employee", className: "lg:col-span-2" },
  { key: "product", label: "Product", className: "lg:col-span-2" },
  { key: "serialNumber", label: "Serial Number", className: "lg:col-span-2" },
  { key: "dueDate", label: "Due Date", className: "lg:col-span-2" },
  { key: "condition", label: "Return Status", className: "lg:col-span-2" },
  { key: "reference", label: "Reference", className: "lg:col-span-2" },
];

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildAssignmentLabel(assignment, employeeMap, productMap) {
  const employeeName = employeeMap.get(assignment.employeeId)?.name || "Unknown employee";
  const product = productMap.get(assignment.productId);
  const productName = product?.productName || "Unknown product";
  const serialNumber = product?.serialNumber || assignment.productId;

  return `${employeeName} • ${productName} • ${serialNumber}`;
}

function ReturnProductPage() {
  const formRef = useRef(null);
  const [assignments, setAssignments] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [employeeMap, setEmployeeMap] = useState(new Map());
  const [productMap, setProductMap] = useState(new Map());
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    assignmentId: "",
    returnCondition: "EXCELLENT",
    inspectorNotes: "",
    returnedDate: new Date().toISOString().slice(0, 10),
  });

  const activeAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status?.toUpperCase() === "ASSIGNED"),
    [assignments],
  );

  const selectedAssignment = useMemo(
    () => activeAssignments.find((assignment) => assignment.id === form.assignmentId) || null,
    [activeAssignments, form.assignmentId],
  );

  const filteredReturnItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) {
      return returnItems;
    }

    return returnItems.filter((item) =>
      [item.employee, item.product, item.serialNumber, item.reference, item.dueDate, item.condition]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [returnItems, searchValue]);

  async function loadReturnData() {
    setLoading(true);

    try {
      const [assignmentsResponse, employeesResponse, productsResponse, returnsResponse] = await Promise.all([
        api.get("/assignments"),
        api.get("/employees"),
        api.get("/products"),
        api.get("/returns"),
      ]);

      const assignmentList = unwrapApiResponse(assignmentsResponse) || [];
      const employees = unwrapApiResponse(employeesResponse) || [];
      const products = unwrapApiResponse(productsResponse) || [];
      const returns = unwrapApiResponse(returnsResponse) || [];

      const nextEmployeeMap = new Map(employees.map((employee) => [employee.id, employee]));
      const nextProductMap = new Map(products.map((product) => [product.id, product]));

      setEmployeeMap(nextEmployeeMap);
      setProductMap(nextProductMap);
      setAssignments(assignmentList);
      setReturnItems(
        assignmentList
          .filter((assignment) => assignment.status?.toUpperCase() === "ASSIGNED")
          .map((assignment) => {
            const product = nextProductMap.get(assignment.productId);
            const returnRecord = returns.find((record) => record.assignmentId === assignment.id);

            return {
              reference: assignment.id,
              employee: nextEmployeeMap.get(assignment.employeeId)?.name || assignment.employeeId,
              product: product?.productName || assignment.productId,
              serialNumber: product?.serialNumber || "Not assigned",
              dueDate: formatDate(assignment.returnDate),
              condition: returnRecord?.returnCondition || "Scheduled",
            };
          }),
      );

      setForm((current) => {
        const selectedStillExists = assignmentList.some(
          (assignment) =>
            assignment.status?.toUpperCase() === "ASSIGNED" && assignment.id === current.assignmentId,
        );
        const nextAssignmentId =
          selectedStillExists
            ? current.assignmentId
            : assignmentList.find((assignment) => assignment.status?.toUpperCase() === "ASSIGNED")?.id || "";

        return {
          ...current,
          assignmentId: nextAssignmentId,
        };
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load return data"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReturnData();
  }, []);

  function focusReturnForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAssignmentSelect(assignmentId) {
    setForm((current) => ({ ...current, assignmentId }));
    setError("");
    setSuccessMessage("");
    focusReturnForm();
  }

  function resetForm() {
    setForm((current) => ({
      ...current,
      assignmentId: activeAssignments[0]?.id || "",
      returnCondition: "EXCELLENT",
      inspectorNotes: "",
      returnedDate: new Date().toISOString().slice(0, 10),
    }));
    setError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/returns", form);
      setSuccessMessage("Return processed successfully.");
      setForm((current) => ({
        ...current,
        assignmentId: "",
        returnCondition: "EXCELLENT",
        inspectorNotes: "",
        returnedDate: new Date().toISOString().slice(0, 10),
      }));
      await loadReturnData();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to process return"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Return Product"
      subtitle="Track incoming returns, inspect condition, and close the loop on each assigned asset."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder="Search employees, products, serials, or references..."
      action={
        <button type="button" className="btn-primary" onClick={focusReturnForm}>
          <CheckCheck size={18} className="mr-2" />
          Close Return
        </button>
      }
    >
      {error ? <div className="mb-6 rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div> : null}
      {successMessage ? (
        <div className="mb-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <div className="grid gap-6">
        <SectionCard
          title="Pending Returns"
          description={
            searchValue
              ? `${filteredReturnItems.length} return record(s) match your search.`
              : "Returns scheduled for verification and restocking."
          }
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
              onClick={loadReturnData}
            >
              <RotateCcw size={16} />
              Refresh
            </button>
          }
        >
          {loading ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">Loading pending returns...</div>
          ) : filteredReturnItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">
              {searchValue ? "No returns match your search." : "No pending returns right now."}
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={filteredReturnItems}
              keyField="reference"
              renderCell={(row, key) => {
                if (key === "condition") {
                  return <StatusBadge value={row.condition} />;
                }

                if (key === "employee" || key === "product") {
                  return <p className="break-words text-sm leading-6 text-slate-600">{row[key]}</p>;
                }

                if (key === "serialNumber" || key === "reference") {
                  return <p className="break-all text-sm leading-6 text-slate-600">{row[key]}</p>;
                }

                if (key === "dueDate") {
                  return <p className="text-sm leading-6 text-slate-600">{row[key]}</p>;
                }

                return <p className="break-words text-sm leading-6 text-slate-600">{row[key]}</p>;
              }}
            />
          )}

          {!loading && filteredReturnItems.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredReturnItems.map((item) => (
                <button
                  key={item.reference}
                  type="button"
                  onClick={() => handleAssignmentSelect(item.reference)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    form.assignmentId === item.reference
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink-900">{item.employee}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.product}</p>
                  <p className="mt-1 break-all text-xs uppercase tracking-[0.16em] text-slate-400">
                    {item.serialNumber}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <StatusBadge value={item.condition} />
                    <span className="text-xs font-medium text-slate-400">{item.dueDate}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Process a Return"
          description="Capture product condition, save notes, and mark the selected assignment as returned."
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
              onClick={resetForm}
              disabled={submitting}
            >
              <Undo2 size={16} />
              Reset Form
            </button>
          }
        >
          <form ref={formRef} className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Active assignment</label>
              <select
                className="field"
                value={form.assignmentId}
                onChange={(event) => setForm((current) => ({ ...current, assignmentId: event.target.value }))}
                disabled={loading || activeAssignments.length === 0}
              >
                <option value="">Select assignment</option>
                {activeAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {buildAssignmentLabel(assignment, employeeMap, productMap)}
                  </option>
                ))}
              </select>
              {selectedAssignment ? (
                <div className="mt-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
                  <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <span className="font-semibold">
                      {employeeMap.get(selectedAssignment.employeeId)?.name || "Unknown employee"}
                    </span>
                    <span>{productMap.get(selectedAssignment.productId)?.productName || "Unknown product"}</span>
                    <span className="break-all text-xs uppercase tracking-[0.16em] text-brand-700">
                      {productMap.get(selectedAssignment.productId)?.serialNumber || selectedAssignment.productId}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-brand-700">
                    Expected return: {formatDate(selectedAssignment.returnDate)}
                  </p>
                </div>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Condition on return</label>
              <select
                className="field"
                value={form.returnCondition}
                onChange={(event) => setForm((current) => ({ ...current, returnCondition: event.target.value }))}
              >
                <option value="EXCELLENT">Excellent</option>
                <option value="VERY GOOD">Very Good</option>
                <option value="GOOD">Good</option>
                <option value="NEEDS REPAIR">Needs Repair</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Returned date</label>
              <input
                className="field"
                type="date"
                value={form.returnedDate}
                onChange={(event) => setForm((current) => ({ ...current, returnedDate: event.target.value }))}
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Inspector notes</label>
              <textarea
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                rows="5"
                placeholder="Document any wear, missing accessories, or repair needs."
                value={form.inspectorNotes}
                onChange={(event) => setForm((current) => ({ ...current, inspectorNotes: event.target.value }))}
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting || !form.assignmentId}>
                <PackageX size={18} className="mr-2" />
                {submitting ? "Marking..." : "Mark as Returned"}
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 sm:w-auto"
                onClick={focusReturnForm}
              >
                <SearchCheck size={16} />
                Review Selection
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageLayout>
  );
}

export default ReturnProductPage;
