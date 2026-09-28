# Aurelia Botanica — Luxury Cash on Delivery (COD) Full-Stack E-Commerce

A modern, production-ready, full-stack e-commerce boutique application engineered for artisanal botanical skincare, haute fragrances, and luxury body care.

Built with **React.js + Tailwind CSS** on the frontend, a production-grade **Java 17 / Spring Boot 3 / Spring Data MongoDB / Spring Security** backend architecture, and a strict **Cash on Delivery (COD) only** checkout workflow.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Architecture & Technologies](#key-architecture--technologies)
3. [COD-Only Business Policy](#cod-only-business-policy)
4. [Design Direction & Aesthetics](#design-direction--aesthetics)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Environment Configuration & Database Security](#environment-configuration--database-security)
8. [Development Credentials](#development-credentials)
9. [Running the Spring Boot Backend](#running-the-spring-boot-backend)
10. [Running the React Frontend & Applet](#running-the-react-frontend--applet)
11. [REST API Specification](#rest-api-specification)
12. [Testing](#testing)
13. [Deployment Instructions](#deployment-instructions)
14. [Security Hardening & Protections](#security-hardening--protections)

---

## 1. Project Overview

Aurelia Botanica is an end-to-end luxury e-commerce platform that pairs an editorial, high-fashion customer shopping experience with an enterprise administration console.

### Customer Storefront Features:
* **Editorial Homepage:** Hero campaign, value pillars, curated harvest showcases, category realms, craftsmanship story, customer testimonials, and botanical newsletter.
* **Boutique Catalog:** Real-time search, category filtering, price range filter, minimum patron rating, in-stock availability toggle, and 5-way sorting (Featured, Newest, Price Low/High, Rating).
* **Contiguous Product Detail Page:** Image zoom & multi-angle gallery, contiguous purchase module, live stock counters, botanical specifications table, usage rituals, and verified patron review submission.
* **Shopping Bag & Slide-Over Drawer:** Real-time quantity adjustments, stock limit validation, promotional coupon application, shipping fee calculation (free over $100), and COD fee transparency.
* **Multi-Step COD Checkout:**
  * Step 1: Customer legal contact details.
  * Step 2: Detailed delivery address (House/Flat, Street, Landmark, City, State, Pincode, Country).
  * Step 3: Itemized order review & customer delivery notes.
  * Step 4: Strict **Cash on Delivery** selection with clear explanation.
  * Step 5: Place order with celebration confetti and confirmed order receipt generation.
* **Order Tracking & Timeline:** Real-time tracking through 6 pipeline stages (`PENDING` $\to$ `CONFIRMED` $\to$ `PROCESSING` $\to$ `SHIPPED` $\to$ `OUT_FOR_DELIVERY` $\to$ `DELIVERED`), with cancellation and return request capabilities.
* **Client Account & Address Book:** Manage profile info, saved addresses (add, edit, delete, set default), order history, and password security.
* **Saved Wishlist:** One-click save with move-to-bag capabilities.

### Enterprise Admin Suite:
* **Admin Dashboard:** Real-time metrics (Gross Cash Collected, Total Consignments, Pending Fulfillment, Low Stock Alerts), interactive monthly sales velocity chart, and order status distribution.
* **Product Catalog Management:** Full CRUD, image management, category assignment, price & discount configuration, stock quantity updates, and active status toggling.
* **Fulfillment & Order Control:** Search, filter by status, view complete order dossiers, and advance order status with custom tracking timeline notes.
* **Stock & Inventory Matrix:** Low-stock threshold alerts, depletion status (`IN STOCK`, `LOW STOCK`, `OUT OF STOCK`), and quick quantity adjustment steppers.
* **Promotions & Vouchers:** Create percentage or fixed discount coupons with minimum order values, maximum discount caps, usage limits, and expiration dates.
* **Patron Account Moderation:** View registered customer accounts, order counts, delivery locations, and toggle account activation.
* **Review Moderation:** Approve, hide, or remove customer product reviews.
* **Store Logistics Settings:** Configure free shipping threshold ($100), standard courier fees ($15), and COD guidance notices.

---

## 2. Key Architecture & Technologies

### Frontend
* **React 19** with TypeScript
* **Tailwind CSS v4** with custom theme tokens
* **Lucide React** luxury iconography
* **Canvas Confetti** order celebration effects
* Context-driven state architecture (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`)
* Persistent client-side data synchronization with live fallback engine

### Backend
* **Java 17**
* **Spring Boot 3.3.4**
* **Spring Web** for RESTful controllers
* **Spring Data MongoDB** with indexed repositories
* **Spring Security 6** with stateless JWT authentication filter (`io.jsonwebtoken 0.11.5`)
* **BCrypt Password Hashing**
* **Bean Validation** (`jakarta.validation`)
* **Global Exception Handling** (`@RestControllerAdvice`) with structured `ApiResponse<T>` envelopes

### Database
* **MongoDB** / **MongoDB Atlas**
* Indexed collections: `users`, `products`, `categories`, `orders`, `reviews`, `coupons`

---

## 3. COD-Only Business Policy

This application is strictly **Cash on Delivery (COD)**.
* **No Online Payment Gateways:** Razorpay, Stripe, PayPal, UPI, credit/debit card forms, net banking, or digital wallets are intentionally omitted.
* **At Checkout:** Clearly states: *"Cash on Delivery — Pay in cash when your order is physically delivered."*
* Customers have full rights to inspect the tamper-evident wax seals on outer packaging before handing cash over to the courier.
* Return requests for COD orders are coordinated through bank transfer or store consignment credit.

---

## 4. Design Direction & Aesthetics

Adheres to high-fashion editorial aesthetics:
* **Primary:** Deep Plum / Burgundy (`#4A1525`, `#360D19`)
* **Secondary:** Rose / Dusty Pink (`#DDA5B0`, `#C77D8D`, `#F8EBEF`)
* **Accent:** Champagne Gold (`#C5A059`, `#E6CA85`)
* **Canvas:** Warm Ivory / Soft Cream (`#FBF9F5`, `#F6F2EB`)
* **Typography:** Editorial Serif headings (*Cormorant Garamond* / *Playfair Display*) paired with clean sans body (*Plus Jakarta Sans*).
* **Zero-Pill Discipline:** Clean unboxed metadata with typographic separators (`·`, `/`).

---

## 5. Project Structure

```
├── backend/                                   # Production Java & Spring Boot Application
│   ├── pom.xml                               # Maven project dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aurelia/ecommerce/
│   │   │   │   ├── AureliaEcommerceApplication.java
│   │   │   │   ├── config/                   # Security, JWT filter, CORS, UserPrincipal
│   │   │   │   ├── controller/               # Auth, Products, Orders, Categories, Reviews, etc.
│   │   │   │   ├── dto/                      # Request / Response payloads & validation
│   │   │   │   ├── exception/                # GlobalExceptionHandler & custom exceptions
│   │   │   │   ├── init/                     # DataSeeder runner
│   │   │   │   ├── model/                    # MongoDB Documents (User, Product, Order, etc.)
│   │   │   │   ├── repository/               # MongoRepositories
│   │   │   │   └── service/                  # Business & fulfillment logic
│   │   │   └── resources/
│   │   │       └── application.yml           # Spring Boot config with environment variables
│   │   └── test/java/com/aurelia/ecommerce/
│   │       └── AureliaEcommerceApplicationTests.java
│
├── src/                                       # Production React Frontend & Live Applet
│   ├── assets/images/                        # High-resolution generated studio assets
│   ├── components/common/                    # Navbar, Footer, ProductCard, CartDrawer, etc.
│   ├── context/                              # AuthContext, CartContext, WishlistContext, ToastContext
│   ├── data/                                 # Seed data for immediate local evaluation
│   ├── pages/
│   │   ├── admin/                            # Admin suite views (Dashboard, Products, Orders, etc.)
│   │   └── customer/                         # Customer views (Home, Shop, Details, Checkout, etc.)
│   ├── services/api.ts                       # REST API client & persistent local database
│   ├── types/index.ts                        # TypeScript interfaces
│   ├── App.tsx                               # Master application routing
│   ├── index.css                             # Tailwind CSS v4 & theme definitions
│   └── main.tsx
│
├── .env.example                              # Environment variable template
├── metadata.json                             # AI Studio applet manifest
├── package.json
└── README.md
```

---

## 6. Prerequisites

* **Frontend:** Node.js 18+ (tested on Node 22)
* **Backend:** Java Development Kit (JDK) 17+ and Apache Maven 3.8+
* **Database:** MongoDB Community Server (v6.0+) or a free MongoDB Atlas Cluster

---

## 7. Environment Configuration & Database Security

Database credentials must **never** be committed to version control or hard-coded into frontend bundles.

### `.env` File Setup
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure parameters:
```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.example.mongodb.net/aurelia_ecommerce

# Spring Boot Server Port
PORT=8080

# JWT Cryptographic Secret (HMAC SHA-512)
JWT_SECRET=9a82f41c6d3b4e5f7a8c9b0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c
JWT_EXPIRATION=86400000

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Development Seed Settings
SEED_DATA_ENABLED=true
ADMIN_DEV_PASSWORD=Admin@12345
```

---

## 8. Development Credentials

Pre-configured accounts for testing:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@aurelia.com` | `Admin@12345` | Full Admin Suite (`ROLE_ADMIN`), Catalog CRUD, Order status transitions, Inventory adjustments, Coupon management |
| **Customer** | `customer@aurelia.com` | `Customer@12345` | Storefront ordering (`ROLE_USER`), Saved addresses, COD checkout, Order tracking |

*Quick-Fill buttons are available on the Sign In page.*

---

## 9. Running the Spring Boot Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The Spring Boot REST API will initialize on `http://localhost:8080`.

---

## 10. Running the React Frontend & Applet

```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 11. REST API Specification

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new patron account
* `POST /api/auth/login` — Authenticate and return JWT token
* `GET /api/auth/me` — Retrieve current authenticated profile
* `POST /api/auth/forgot-password` — Generate password reset token
* `POST /api/auth/reset-password` — Reset password using token

### Products (`/api/products`)
* `GET /api/products` — Retrieve paginated products with category/search filters
* `GET /api/products/{id}` — Get single formulation details
* `GET /api/products/featured` — Get homepage featured items
* `GET /api/products/new-arrivals` — Get newest harvest additions
* `POST /api/products` — Create formulation (*Admin only*)
* `PUT /api/products/{id}` — Update formulation (*Admin only*)
* `PATCH /api/products/{id}/stock` — Adjust inventory quantity (*Admin only*)
* `DELETE /api/products/{id}` — Remove formulation (*Admin only*)

### Orders & Fulfillment (`/api/orders`)
* `POST /api/orders` — Place order (**Cash on Delivery only**)
* `GET /api/orders` — List authenticated patron's orders
* `GET /api/orders/{id}` — View order details
* `GET /api/orders/admin/all` — List all orders across patrons (*Admin only*)
* `PUT /api/orders/{id}/status` — Update order status & log timeline note (*Admin only*)
* `POST /api/orders/{id}/cancel` — Cancel order prior to shipping
* `POST /api/orders/{id}/return` — Submit return request for delivered order

### Coupons (`/api/coupons`)
* `POST /api/coupons/validate` — Validate voucher code and compute discount
* `GET /api/coupons` — List all active vouchers (*Admin only*)
* `POST /api/coupons` — Create voucher (*Admin only*)
* `PUT /api/coupons/{id}` — Update voucher (*Admin only*)
* `DELETE /api/coupons/{id}` — Delete voucher (*Admin only*)

### Reviews (`/api/reviews`)
* `GET /api/reviews/product/{productId}` — Approved reviews for a formulation
* `POST /api/reviews/product/{productId}` — Submit review (*Authenticated only*)
* `GET /api/reviews/admin/all` — Moderation review list (*Admin only*)
* `PATCH /api/reviews/admin/{id}/toggle-approval` — Toggle review approval (*Admin only*)

---

## 12. Testing

### Run Backend Unit & Integration Tests:
```bash
cd backend
mvn test
```

### Validate Frontend Compilation & Linting:
```bash
npm run build
npm run lint
```

---

## 13. Deployment Instructions

### Production Frontend Build
```bash
npm run build
```
Creates an optimized static production distribution in `dist/`.

### Production Backend Jar
```bash
cd backend
mvn clean package -DskipTests
java -jar target/ecommerce-backend-1.0.0.jar
```

---

## 14. Security Hardening & Protections

1. **Stateless JWT Tokens:** Authentication is handled via signed JSON Web Tokens using standard HMAC SHA-512 signatures.
2. **Strict Server-Side Pricing:** Product prices and stock limits are looked up directly from MongoDB. Frontend pricing cannot be tampered with.
3. **Inventory Concurrency Protection:** Stocks are decremented upon checkout; cancelled orders automatically return inventory back into circulation.
4. **Credential Isolation:** MongoDB connection strings and JWT signing secrets are read exclusively from environment variables.
5. **No Stack Trace Leaks:** Production responses sanitize stack traces and return structured `ApiResponse<T>` error envelopes.
