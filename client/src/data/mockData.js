export const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Employees", path: "/employees" },
  { label: "Products", path: "/products" },
  { label: "Assign Product", path: "/assign-product" },
  { label: "Return Product", path: "/return-product" },
  { label: "Admin Settings", path: "/admin-settings" },
];

export const stats = [
  { label: "Active Employees", value: "248", trend: "+12 this month" },
  { label: "Products In Stock", value: "1,426", trend: "92% utilization" },
  { label: "Assigned Assets", value: "1,118", trend: "48 pending returns" },
  { label: "Open Requests", value: "36", trend: "7 urgent approvals" },
];

export const recentAssignments = [
  {
    employee: "Riya Sharma",
    product: "MacBook Pro 14",
    department: "Design",
    assignedOn: "28 Apr 2026",
    status: "Assigned",
  },
  {
    employee: "Aarav Patel",
    product: "iPhone 15",
    department: "Sales",
    assignedOn: "27 Apr 2026",
    status: "Pending Return",
  },
  {
    employee: "Neha Singh",
    product: "Dell UltraSharp 27",
    department: "Engineering",
    assignedOn: "26 Apr 2026",
    status: "Assigned",
  },
];

export const employees = [
  {
    id: "EMP-1042",
    name: "Riya Sharma",
    department: "Design",
    email: "riya.sharma@officehub.com",
    phone: "+91 98765 44120",
    status: "Active",
  },
  {
    id: "EMP-1047",
    name: "Aarav Patel",
    department: "Sales",
    email: "aarav.patel@officehub.com",
    phone: "+91 98123 10457",
    status: "Onboarding",
  },
  {
    id: "EMP-1061",
    name: "Meera Nair",
    department: "HR",
    email: "meera.nair@officehub.com",
    phone: "+91 98221 32041",
    status: "Active",
  },
  {
    id: "EMP-1076",
    name: "Kabir Verma",
    department: "Engineering",
    email: "kabir.verma@officehub.com",
    phone: "+91 99303 22876",
    status: "Remote",
  },
];

export const products = [
  {
    sku: "LTP-201",
    name: "MacBook Pro 14",
    category: "Laptop",
    stock: 24,
    assigned: 19,
    condition: "Excellent",
  },
  {
    sku: "PHN-122",
    name: "iPhone 15",
    category: "Phone",
    stock: 40,
    assigned: 33,
    condition: "Good",
  },
  {
    sku: "MON-450",
    name: "Dell UltraSharp 27",
    category: "Monitor",
    stock: 32,
    assigned: 18,
    condition: "Excellent",
  },
  {
    sku: "HDP-071",
    name: "Sony WH-1000XM5",
    category: "Headset",
    stock: 18,
    assigned: 9,
    condition: "Very Good",
  },
];

export const returnItems = [
  {
    reference: "RET-301",
    employee: "Aarav Patel",
    product: "iPhone 15",
    dueDate: "29 Apr 2026",
    condition: "Inspection Due",
  },
  {
    reference: "RET-302",
    employee: "Kabir Verma",
    product: "Sony WH-1000XM5",
    dueDate: "01 May 2026",
    condition: "Scheduled",
  },
  {
    reference: "RET-303",
    employee: "Riya Sharma",
    product: "MacBook Pro 14",
    dueDate: "04 May 2026",
    condition: "In Review",
  },
];
