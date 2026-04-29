import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import DataTable from "../components/DataTable";
import PageLayout from "../components/PageLayout";
import SectionCard from "../components/SectionCard";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";

const columns = [
  { key: "name", label: "Employee", className: "lg:col-span-4" },
  { key: "department", label: "Department", className: "lg:col-span-2" },
  { key: "email", label: "Email", className: "lg:col-span-3" },
  { key: "phone", label: "Phone", className: "lg:col-span-2" },
  { key: "actions", label: "Actions", className: "lg:col-span-1" },
];

function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const formSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  const filteredEmployees = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();
    if (!query) {
      return employees;
    }

    return employees.filter((employee) =>
      [employee.name, employee.department, employee.email, employee.phone, employee.id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [deferredSearchTerm, employees]);

  async function loadEmployees() {
    setLoading(true);

    try {
      const response = await api.get("/employees");
      setEmployees(unwrapApiResponse(response) || []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load employees"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingEmployeeId) {
        await api.put(`/employees/${editingEmployeeId}`, form);
        setSuccessMessage("Employee updated successfully.");
      } else {
        await api.post("/employees", form);
        setSuccessMessage("Employee created successfully.");
      }
      setForm({ name: "", department: "", email: "", phone: "" });
      setEditingEmployeeId("");
      await loadEmployees();
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          editingEmployeeId ? "Unable to update employee" : "Unable to create employee",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddEmployeeClick() {
    setEditingEmployeeId("");
    setForm({ name: "", department: "", email: "", phone: "" });
    setError("");
    setSuccessMessage("");
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleEditEmployee(employee) {
    setEditingEmployeeId(employee.id);
    setForm({
      name: employee.name || "",
      department: employee.department || "",
      email: employee.email || "",
      phone: employee.phone || "",
    });
    setError("");
    setSuccessMessage("");
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleDeleteEmployee(employee) {
    const confirmed = window.confirm(`Delete employee "${employee.name}"?`);
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await api.delete(`/employees/${employee.id}`);
      if (editingEmployeeId === employee.id) {
        setEditingEmployeeId("");
        setForm({ name: "", department: "", email: "", phone: "" });
      }
      setSuccessMessage("Employee deleted successfully.");
      await loadEmployees();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to delete employee"));
    }
  }

  async function createEmployeeRecord(employee) {
    await api.post("/employees", employee);
  }

  function parseCsvContent(csvContent) {
    const [headerRow, ...dataRows] = csvContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!headerRow) {
      throw new Error("CSV file is empty");
    }

    const headers = headerRow.split(",").map((header) => header.trim().toLowerCase());
    const requiredHeaders = ["name", "department", "email", "phone"];

    if (!requiredHeaders.every((header) => headers.includes(header))) {
      throw new Error("CSV must include name, department, email, and phone columns");
    }

    return dataRows.map((row) => {
      const values = row.split(",").map((value) => value.trim());
      const record = {};

      headers.forEach((header, index) => {
        record[header] = values[index] || "";
      });

      return {
        name: record.name,
        department: record.department,
        email: record.email,
        phone: record.phone,
      };
    });
  }

  async function handleCsvUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const csvContent = await file.text();
      const importedEmployees = parseCsvContent(csvContent);

      for (const employee of importedEmployees) {
        await createEmployeeRecord(employee);
      }

      setSuccessMessage(`${importedEmployees.length} employee record(s) imported successfully.`);
      await loadEmployees();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : getApiErrorMessage(requestError, "Unable to import employees"),
      );
    } finally {
      event.target.value = "";
    }
  }

  return (
    <PageLayout
      title="Employee Management"
      subtitle="Keep employee records accurate so each assigned product remains mapped to the right owner and department."
      searchValue={searchTerm}
      searchPlaceholder="Search employees by name, email, department..."
      onSearchChange={setSearchTerm}
      onNotificationsClick={() => setSuccessMessage("Employee notifications are up to date.")}
      action={
        <button type="button" className="btn-primary w-full sm:w-auto" onClick={handleAddEmployeeClick}>
          <Plus size={18} className="mr-2" />
          Add Employee
        </button>
      }
    >
      {error ? <div className="mb-6 rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div> : null}
      {successMessage ? (
        <div className="mb-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <div className="grid gap-6">
        <SectionCard
          title="Employee Directory"
          description={`${filteredEmployees.length} employee record(s) shown.`}
          action={
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} className="mr-2" />
              Import CSV
            </button>
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
          />
          {loading ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">No employees found.</div>
          ) : (
            <DataTable
              columns={columns}
              rows={filteredEmployees}
              keyField="id"
              renderCell={(row, key) => {
                if (key === "name") {
                  return (
                    <div className="min-w-0">
                      <p className="break-words text-base font-semibold leading-7 text-ink-900">{row.name}</p>
                      <p className="break-all text-sm text-slate-500">{row.id}</p>
                    </div>
                  );
                }

                if (key === "email") {
                  return <p className="break-all text-sm leading-6 text-slate-600">{row[key]}</p>;
                }

                if (key === "actions") {
                  return (
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => handleEditEmployee(row)}
                        className="btn-secondary px-3 py-2 text-xs"
                      >
                        <Pencil size={14} className="mr-1.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEmployee(row)}
                        className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
                      >
                        <Trash2 size={14} className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  );
                }

                return <p className="break-words text-sm leading-6 text-slate-600">{row[key]}</p>;
              }}
            />
          )}
        </SectionCard>

        <SectionCard
          title={editingEmployeeId ? "Edit Employee" : "Add New Employee"}
          description={
            editingEmployeeId
              ? "Update the selected employee profile and save your changes."
              : "Create a profile ready for product assignment."
          }
        >
          <form ref={formSectionRef} className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Full name</label>
              <input
                className="field"
                placeholder="Enter employee name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Department</label>
              <input
                className="field"
                placeholder="Engineering"
                value={form.department}
                onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <input
                className="field"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Phone</label>
              <input
                className="field"
                placeholder="+91 98..."
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                required
              />
            </div>
            <div className="lg:col-span-2 flex items-end">
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary w-full lg:w-auto" disabled={submitting}>
                  {submitting
                    ? editingEmployeeId
                      ? "Updating..."
                      : "Saving..."
                    : editingEmployeeId
                      ? "Update Employee"
                      : "Save Employee"}
                </button>
                {editingEmployeeId ? (
                  <button
                    type="button"
                    className="btn-secondary w-full lg:w-auto"
                    onClick={handleAddEmployeeClick}
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

export default EmployeeManagementPage;
