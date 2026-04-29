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
export JWT_SECRET=$(printf 'office-product-management-secret-key-2026' | base64)
export JWT_EXPIRATION_MS=86400000
```

2. Start the app:

```bash
mvn spring-boot:run
```

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
