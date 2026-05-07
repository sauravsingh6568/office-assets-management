# Office Product Management Backend

Spring Boot backend with:

- REST APIs
- MongoDB integration
- Maven setup
- JWT authentication
- CRUD operations for employees and products
- Assignment and return workflows

## Run locally

1. Set environment variables if needed:

```bash
export MONGODB_URI=mongodb://localhost:27017/office_product_management
export MONGODB_DATABASE=office_product_management
export JWT_SECRET=$(printf 'office-product-management-secret-key-2026' | base64)
export JWT_EXPIRATION_MS=86400000
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

2. Start the app:

```bash
mvn spring-boot:run
```

## Running Backend Cross-Platform

For macOS/Linux:

```bash
./mvnw spring-boot:run
```

For Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

## Deploy

### Backend on Render

The repository includes [render.yaml](/Users/sauravkumarsingh/Desktop/office-product-management/render.yaml:1).

Required environment variables on Render:

- `MONGODB_URI`
- `MONGODB_DATABASE`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

Optional seed variables for first admin creation:

- `ADMIN_SEED_NAME`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`

Recommended `CORS_ALLOWED_ORIGINS` value after frontend deploy:

```bash
https://your-site-name.netlify.app
```

### Frontend on Netlify

The repository includes [netlify.toml](/Users/sauravkumarsingh/Desktop/office-product-management/netlify.toml:1).

Set this environment variable in Netlify:

```bash
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

Because the app uses React Router, the Netlify redirect is already configured so deep links like `/dashboard` and `/return-product` keep working.

## API overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Employees

- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`

### Products

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Assignments

- `GET /api/assignments`
- `GET /api/assignments/{id}`
- `POST /api/assignments`
- `PATCH /api/assignments/{id}/return`
- `DELETE /api/assignments/{id}`

### Returns

- `GET /api/returns`
- `GET /api/returns/{id}`
- `POST /api/returns`

Use `Authorization: Bearer <jwt-token>` for all protected endpoints.
