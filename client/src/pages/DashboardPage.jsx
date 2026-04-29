import { useEffect, useState } from "react";
import { ArrowUpRight, Download, Plus } from "lucide-react";
import PageLayout from "../components/PageLayout";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [analyticsResponse, assignmentsResponse, employeesResponse, productsResponse] =
          await Promise.all([
            api.get("/dashboard/analytics"),
            api.get("/assignments"),
            api.get("/employees"),
            api.get("/products"),
          ]);

        const analytics = unwrapApiResponse(analyticsResponse);
        const assignments = unwrapApiResponse(assignmentsResponse) || [];
        const employees = unwrapApiResponse(employeesResponse) || [];
        const products = unwrapApiResponse(productsResponse) || [];

        const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));
        const productMap = new Map(products.map((product) => [product.id, product]));

        setStats([
          { label: "Total Employees", value: analytics.totalEmployees, trend: "Registered employees" },
          { label: "Total Products", value: analytics.totalProducts, trend: "Tracked inventory items" },
          { label: "Active Assignments", value: analytics.activeAssignments, trend: "Currently in use" },
          { label: "Available Products", value: analytics.availableProducts, trend: "Ready to assign" },
        ]);

        setRecentAssignments(
          [...assignments]
            .sort((left, right) => new Date(right.assignedDate) - new Date(left.assignedDate))
            .slice(0, 3)
            .map((assignment) => ({
              id: assignment.id,
              employee: employeeMap.get(assignment.employeeId)?.name || assignment.employeeId,
              product: productMap.get(assignment.productId)?.productName || assignment.productId,
              department: employeeMap.get(assignment.employeeId)?.department || "Unknown",
              assignedOn: formatDate(assignment.assignedDate),
              status: assignment.status,
            })),
        );
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Unable to load dashboard data"));
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Track inventory health, assignment flow, and employee activity from a single responsive workspace."
      action={
        <button type="button" className="btn-primary">
          <Plus size={18} className="mr-2" />
          New Request
        </button>
      }
    >
      {error ? <div className="mb-6 rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {(loading ? [] : stats).map((item) => (
          <article key={item.label} className="panel p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-ink-900">{item.value}</p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-brand-700">{item.trend}</p>
          </article>
        ))}
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <article key={index} className="panel p-5 sm:p-6">
                <p className="text-sm text-slate-500">Loading...</p>
              </article>
            ))
          : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Recent Product Assignments"
          description="Latest asset handovers and pending returns across departments."
          action={
            <button type="button" className="btn-secondary">
              <Download size={18} className="mr-2" />
              Export
            </button>
          }
        >
          <div className="space-y-4">
            {!loading && recentAssignments.length === 0 ? (
              <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">
                No assignments found yet.
              </div>
            ) : null}
            {recentAssignments.map((item) => (
              <div
                key={`${item.employee}-${item.product}`}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-ink-900">{item.employee}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.product} • {item.department}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <p className="text-sm text-slate-500">{item.assignedOn}</p>
                  <StatusBadge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Workflow Snapshot" description="Operational focus areas for today.">
          <div className="space-y-4">
            {[
              ["Dashboard visibility", "Live counts now come directly from the Spring Boot analytics API."],
              ["Assignment monitoring", "Recent assignment activity is pulled from the backend in real time."],
              ["Admin security", "Dashboard access is gated by JWT-authenticated admin sessions."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl bg-white p-5">
                <p className="text-sm font-semibold text-ink-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
