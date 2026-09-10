# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Website Katalog Hampers Kue — MVP

**Versi:** 1.0
**Status:** Draft MVP
**Platform:** Web Responsive
**Target:** Customer & Admin/Owner

---

# 1. Product Overview

Website ini merupakan platform katalog digital untuk bisnis hampers kue yang memungkinkan calon pelanggan melihat produk, mengetahui detail hampers, memilih varian atau kebutuhan custom sederhana, kemudian melakukan pemesanan melalui WhatsApp.

Sistem juga menyediakan halaman admin untuk mengelola katalog produk dan kategori tanpa harus mengubah kode aplikasi.

### Tujuan MVP

1. Menampilkan produk hampers secara profesional.
2. Memudahkan pelanggan menemukan hampers berdasarkan kebutuhan/acara.
3. Menampilkan informasi produk secara lengkap.
4. Mempermudah pelanggan melakukan pemesanan melalui WhatsApp.
5. Memudahkan owner mengelola katalog produk.

---

# 2. Goals & Objectives

## Primary Goals

* Meningkatkan kualitas digital presence bisnis.
* Menjadikan website sebagai katalog utama produk.
* Mengurangi proses manual ketika pelanggan menanyakan produk.
* Mengarahkan pelanggan dari katalog langsung ke WhatsApp.
* Memberikan owner kemampuan mengelola produk secara mandiri.

## Success Metrics

MVP dianggap berhasil apabila:

* Customer dapat menemukan produk dengan mudah.
* Customer dapat melihat detail produk.
* Customer dapat mengirim request order melalui WhatsApp.
* Admin dapat menambah, mengubah, dan menghapus produk.
* Website nyaman digunakan melalui mobile maupun desktop.

---

# 3. Target Users

## 3.1 Customer

Calon pembeli hampers yang ingin:

* mencari hadiah,
* membeli hampers untuk acara tertentu,
* melihat harga dan isi hampers,
* mencari hampers sesuai budget,
* melakukan custom sederhana,
* menghubungi owner untuk melakukan pemesanan.

## 3.2 Admin / Owner

Pemilik bisnis yang ingin:

* mengelola produk,
* mengelola kategori,
* mengubah informasi produk,
* mengatur status ketersediaan produk,
* mengelola informasi kontak bisnis.

---

# 4. MVP Scope

Fitur yang termasuk MVP:

### Customer

1. Landing Page
2. Katalog Produk
3. Kategori Produk
4. Detail Produk
5. Custom Hampers sederhana
6. Order melalui WhatsApp
7. Informasi bisnis

### Admin

1. Login Admin
2. Dashboard
3. CRUD Produk
4. CRUD Kategori
5. Upload foto produk
6. Aktif/nonaktif produk
7. Pengaturan WhatsApp bisnis

---

# 5. User Flow

## 5.1 Customer Flow

```text
Landing Page
      │
      ▼
 Lihat Katalog
      │
      ▼
Pilih Kategori
      │
      ▼
Pilih Produk
      │
      ▼
Detail Produk
      │
      ├───────────────┐
      ▼               ▼
Pilih Varian     Custom Hampers
      │               │
      └───────┬───────┘
              ▼
      Pesan via WhatsApp
              │
              ▼
       Chat dengan Owner
```

## 5.2 Admin Flow

```text
Login
  │
  ▼
Dashboard
  │
  ├── Produk
  │    ├── List
  │    ├── Tambah
  │    ├── Edit
  │    └── Hapus
  │
  ├── Kategori
  │    ├── List
  │    ├── Tambah
  │    ├── Edit
  │    └── Hapus
  │
  └── Pengaturan
       └── WhatsApp Bisnis
```

---

# 6. Functional Requirements

## FR-01 — Landing Page

Website harus menyediakan landing page sebagai halaman utama.

### Content

* Hero section
* Nama brand
* Tagline
* Foto utama hampers
* CTA "Lihat Hampers"
* Keunggulan bisnis
* Produk unggulan
* Kategori hampers
* Testimoni
* CTA WhatsApp
* Footer

### CTA

Tombol utama:

> Lihat Hampers

Tombol komunikasi:

> Pesan via WhatsApp

---

# 7. FR-02 — Katalog Produk

Customer dapat melihat seluruh produk yang tersedia.

### Informasi Product Card

* Foto
* Nama produk
* Harga mulai
* Kategori
* Status ketersediaan
* Tombol "Lihat Detail"

### Filter

Customer dapat melakukan filter berdasarkan kategori.

Contoh:

```text
Semua
Birthday
Wedding
Anniversary
Lebaran
Christmas
Corporate
Custom
```

### Product Status

Produk memiliki status:

```text
AVAILABLE
UNAVAILABLE
```

Produk `UNAVAILABLE` tetap dapat ditampilkan tetapi tidak dapat dipesan.

---

# 8. FR-03 — Detail Produk

Customer dapat melihat informasi lengkap sebuah produk.

### Informasi

* Gallery foto
* Nama produk
* Harga
* Deskripsi
* Isi hampers
* Varian/ukuran
* Kategori
* Status ketersediaan
* Informasi custom
* Tombol order

### Contoh

```text
Sweet Celebration Box

Rp150.000

Isi:
- Brownies
- Cookies
- Nastar
- Greeting Card

Ukuran:
○ Small
○ Medium
○ Large

[Pesan via WhatsApp]
```

---

# 9. FR-04 — Custom Hampers

Website menyediakan fitur custom sederhana.

Customer dapat menentukan:

### Budget

```text
Rp100.000
Rp150.000
Rp200.000
Rp300.000+
```

### Pilihan Isi

Contoh:

```text
Cookies
Brownies
Nastar
Kue Kering
Cake
Chocolate
```

### Packaging

```text
Box
Basket
Premium Box
Custom
```

### Greeting Card

```text
Ya
Tidak
```

### Catatan

Customer dapat memasukkan kebutuhan tambahan.

Contoh:

> "Untuk ulang tahun ibu, minta warna packaging biru."

### Output

Tidak perlu membuat konfigurator harga otomatis pada MVP.

Customer diarahkan ke WhatsApp dengan data custom yang sudah dipilih.

---

# 10. FR-05 — WhatsApp Ordering

Customer dapat melakukan order melalui WhatsApp.

Website harus membuat pesan WhatsApp secara otomatis berdasarkan produk/permintaan customer.

### Contoh Message

```text
Halo Kak, saya tertarik dengan hampers:

Produk:
Sweet Celebration Box

Varian:
Large

Jumlah:
2

Catatan:
Untuk hadiah ulang tahun.

Apakah produknya masih tersedia?
```

Customer kemudian diarahkan ke WhatsApp bisnis.

### Catatan

MVP tidak membutuhkan:

* payment gateway,
* checkout system,
* payment confirmation,
* shipping calculation,
* order tracking.

Proses transaksi dilakukan oleh customer dan owner melalui WhatsApp.

---

# 11. FR-06 — Informasi Bisnis

Website harus menampilkan informasi dasar bisnis:

* Nama bisnis
* Deskripsi
* Nomor WhatsApp
* Instagram
* Alamat jika tersedia
* Jam operasional
* Link social media

Informasi tersebut dapat dikelola admin.

---

# 12. FR-07 — Admin Authentication

Admin harus login sebelum mengakses dashboard.

### Login

Field:

```text
Email
Password
```

### Requirements

* Password harus disimpan secara hashed.
* Hanya user dengan role `ADMIN` yang dapat mengakses dashboard.
* Customer tidak membutuhkan akun untuk melihat katalog.

---

# 13. FR-08 — Admin Dashboard

Dashboard menampilkan informasi ringkas.

Contoh:

```text
Dashboard

Total Produk       24
Produk Aktif       20
Produk Tidak Aktif 4
Total Kategori     7
```

MVP tidak membutuhkan statistik penjualan karena transaksi dilakukan melalui WhatsApp.

---

# 14. FR-09 — Product Management

Admin dapat:

* melihat daftar produk,
* menambahkan produk,
* mengubah produk,
* menghapus produk,
* mengaktifkan/nonaktifkan produk.

### Product Fields

```text
id
category_id
name
slug
description
price
stock_status
is_active
created_at
updated_at
```

### Product Image

Produk dapat memiliki beberapa gambar.

Fields:

```text
id
product_id
image_url
sort_order
```

---

# 15. FR-10 — Category Management

Admin dapat:

* melihat kategori,
* menambah kategori,
* mengubah kategori,
* menghapus kategori.

### Category Fields

```text
id
name
slug
description
is_active
created_at
updated_at
```

---

# 16. FR-11 — Business Settings

Admin dapat mengubah informasi bisnis.

### Fields

```text
business_name
description
whatsapp_number
instagram_url
address
operating_hours
```

Informasi ini digunakan pada landing page, footer, dan WhatsApp ordering.

---

# 17. Database Design

## users

```text
id
name
email
password
role
created_at
updated_at
```

Role:

```text
ADMIN
```

---

## categories

```text
id
name
slug
description
is_active
created_at
updated_at
```

---

## products

```text
id
category_id
name
slug
description
price
stock_status
is_active
created_at
updated_at
```

Relationship:

```text
Category 1 ─────── N Product
```

---

## product_images

```text
id
product_id
image_url
sort_order
created_at
updated_at
```

Relationship:

```text
Product 1 ─────── N ProductImage
```

---

## business_settings

```text
id
business_name
description
whatsapp_number
instagram_url
address
operating_hours
created_at
updated_at
```

---

# 18. Entity Relationship Diagram

```text
┌──────────────┐
│   CATEGORY   │
├──────────────┤
│ id           │
│ name         │
│ slug         │
│ description  │
│ is_active    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   PRODUCT    │
├──────────────┤
│ id           │
│ category_id  │
│ name         │
│ slug         │
│ description  │
│ price        │
│ stock_status │
│ is_active    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌────────────────┐
│ PRODUCT_IMAGE  │
├────────────────┤
│ id             │
│ product_id     │
│ image_url      │
│ sort_order     │
└────────────────┘


┌──────────────┐
│    USERS     │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ password     │
│ role         │
└──────────────┘


┌────────────────────┐
│ BUSINESS_SETTINGS  │
├────────────────────┤
│ id                 │
│ business_name      │
│ description        │
│ whatsapp_number    │
│ instagram_url      │
│ address            │
│ operating_hours    │
└────────────────────┘
```

---

# 19. Non-Functional Requirements

## NFR-01 — Responsive

Website harus dapat digunakan pada:

* Mobile
* Tablet
* Desktop

Prioritas desain adalah **mobile-first**.

## NFR-02 — Performance

* Optimasi ukuran gambar.
* Lazy loading untuk gambar katalog.
* Gunakan image optimization.
* Hindari animasi berlebihan.

## NFR-03 — Security

* Password admin harus di-hash.
* Endpoint admin harus dilindungi authentication.
* Validasi input backend wajib dilakukan.
* Admin API tidak boleh dapat diakses tanpa authorization.

## NFR-04 — SEO

Landing page dan produk harus memiliki:

* title
* meta description
* slug yang readable
* Open Graph metadata

Contoh slug:

```text
/hampers/sweet-celebration-box
```

---

# 20. UI/UX Requirements

## Design Direction

Website harus memiliki kesan:

* Premium
* Manis
* Elegan
* Warm
* Modern
* Tidak terlalu ramai

### Design Principles

* Product photo menjadi fokus utama.
* Typography mudah dibaca.
* CTA WhatsApp jelas.
* Navigasi sederhana.
* White space cukup.
* Mobile-first.

---

# 21. Pages / Sitemap

```text
/
│
├── /hampers
│
├── /hampers/[slug]
│
├── /custom
│
├── /about
│
│
└── /admin
     │
     ├── /login
     │
     ├── /dashboard
     │
     ├── /products
     │
     ├── /products/create
     │
     ├── /products/[id]/edit
     │
     ├── /categories
     │
     └── /settings
```

---

# 22. MVP API Requirements

Jika menggunakan backend API, endpoint minimum:

## Authentication

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Products

```text
GET    /api/products
GET    /api/products/:slug
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Business Settings

```text
GET /api/settings
PUT /api/settings
```

Endpoint `POST`, `PUT`, dan `DELETE` untuk management hanya dapat digunakan oleh admin.

---

# 23. Out of Scope — MVP

Fitur berikut **tidak dibuat pada MVP**:

* Payment Gateway
* Shopping Cart kompleks
* Online Checkout
* Order Tracking
* Delivery Tracking
* Voucher
* Discount Engine
* Loyalty / Point
* Customer Account
* Review System
* Notification System
* Email Marketing
* Inventory Management kompleks
* Multi-tenant
* Multi-admin permission
* Analytics penjualan kompleks
* AI Recommendation
* Live Chat
* Automatic shipping calculation

Fitur tersebut dapat dipertimbangkan pada versi berikutnya.

---

# 24. Future Development — V1+

Setelah MVP berhasil digunakan:

### V1

* Shopping cart
* Checkout
* Order management
* Customer database
* Order history
* Payment gateway
* Promo/voucher
* Stock management

### V2

* Customer account
* Loyalty point
* Review produk
* Notification
* Delivery integration
* Sales analytics
* Dashboard revenue

### V3

* Recommendation system
* AI-assisted custom hampers
* Personalized product recommendation
* Campaign management
* Customer segmentation

---

# 25. MVP Acceptance Criteria

MVP dianggap selesai apabila:

### Customer

* [ ] Customer dapat membuka landing page.
* [ ] Customer dapat melihat katalog.
* [ ] Customer dapat memfilter produk berdasarkan kategori.
* [ ] Customer dapat membuka detail produk.
* [ ] Customer dapat melihat foto produk.
* [ ] Customer dapat melihat harga dan isi hampers.
* [ ] Customer dapat memilih varian jika tersedia.
* [ ] Customer dapat melakukan custom request sederhana.
* [ ] Customer dapat mengirim order melalui WhatsApp.
* [ ] Website responsive di mobile dan desktop.

### Admin

* [ ] Admin dapat login.
* [ ] Admin dapat melihat dashboard.
* [ ] Admin dapat melihat daftar produk.
* [ ] Admin dapat menambahkan produk.
* [ ] Admin dapat mengedit produk.
* [ ] Admin dapat menghapus produk.
* [ ] Admin dapat mengaktifkan/nonaktifkan produk.
* [ ] Admin dapat mengelola kategori.
* [ ] Admin dapat mengubah nomor WhatsApp bisnis.
* [ ] Admin dapat mengubah informasi bisnis.

---

# 26. Recommended MVP Tech Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
```

## Backend

Untuk MVP dapat menggunakan:

```text
Next.js API / Server Actions
```

Jika ingin memisahkan backend:

```text
NestJS
REST API
```

## Database

```text
PostgreSQL
```

## Image Storage

```text
Cloudinary
```

## Communication

```text
WhatsApp
```

## Deployment

```text
Frontend : Vercel
Database : PostgreSQL hosting
Storage  : Cloudinary
```

---

# 27. Development Priority

Prioritas pengerjaan:

```text
P0 — WAJIB

1. Database
2. Admin Authentication
3. Category CRUD
4. Product CRUD
5. Product Image
6. Public Catalog
7. Product Detail
8. WhatsApp Ordering
9. Responsive UI


P1 — PENTING

10. Landing Page
11. Custom Hampers
12. Business Settings
13. SEO


P2 — SETELAH MVP

14. Cart
15. Checkout
16. Payment
17. Order Management
18. Customer Account
19. Analytics
```

---

# 28. Definition of Done

MVP dinyatakan selesai apabila seluruh fitur P0 telah berjalan end-to-end.

Contoh alur yang harus berhasil:

```text
Admin Login
     ↓
Tambah Category
     ↓
Tambah Product
     ↓
Upload Product Image
     ↓
Product tampil di Catalog
     ↓
Customer membuka Product
     ↓
Customer memilih variant
     ↓
Customer klik "Pesan via WhatsApp"
     ↓
WhatsApp terbuka
     ↓
Pesan order otomatis terisi
```

Tidak ada fitur tambahan yang diperlukan untuk menyatakan MVP selesai.

---

# 29. Product Principle

> **"Catalog first, transaction later."**

MVP tidak bertujuan menjadi marketplace atau e-commerce penuh.

Fokus utama adalah membuat **katalog hampers yang menarik, mudah dikelola, dan mampu mengubah pengunjung menjadi calon pembeli melalui WhatsApp.**
