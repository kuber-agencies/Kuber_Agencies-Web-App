# Kuber Agencies – Full-Stack Web Application

> Production-ready B2B hardware supplier platform optimised for government tenders, contractor deals, and bulk orders.

---

## 🗂️ Project Structure

```
kuber-agencies/
├── client/          # React + Vite + Tailwind frontend
└── server/          # Node.js + Express + MongoDB backend
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary keys, email creds

# Frontend
cd client
cp .env.example .env
# Edit VITE_API_URL and WhatsApp number
```

### 3. Create First Admin Account

Start the backend server, then POST to the setup endpoint (once only):

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@kuberagencies.com","password":"StrongPassword123"}'
```

> ⚠️ This route auto-disables once the first admin is created.

### 4. Run Development Servers

```bash
# Terminal 1 – Backend (port 5000)
cd server
npm run dev

# Terminal 2 – Frontend (port 5173)
cd client
npm run dev
```

---

## 🔑 Environment Variables

### Server `.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (e.g. `587`) |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASS` | App-specific email password |
| `ADMIN_EMAIL` | Email to receive RFQ alerts |
| `CLIENT_URL` | Frontend URL for CORS |

### Client `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://api.kuberagencies.com/api`) |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number with country code (e.g. `919876543210`) |
| `VITE_WHATSAPP_MESSAGE` | URL-encoded default WhatsApp message |

---

## 🚀 Deployment

### Frontend → Vercel / Netlify

```bash
cd client
npm run build
# Deploy the `dist/` folder
```

- Set `VITE_API_URL` as environment variable in Vercel/Netlify dashboard
- Add `_redirects` file for SPA routing on Netlify:  
  ```
  /*    /index.html    200
  ```

### Backend → Render

1. Connect your GitHub repo to [render.com](https://render.com)
2. Set **Root Directory** to `server`
3. **Build command:** `npm install`
4. **Start command:** `node index.js`
5. Add all environment variables in Render dashboard
6. Set `NODE_ENV=production`

---

## 📄 API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List products (filter, search, paginate) |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/rfq` | Submit RFQ (rate limited: 10/hr) |
| `GET` | `/api/projects` | List government projects |
| `GET` | `/api/documents` | List public documents |
| `POST` | `/api/documents/:id/download` | Track download |
| `POST` | `/api/documents/request-email` | Send docs via email |

### Admin (JWT Protected)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Get current admin |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/rfq` | List all RFQs with stats |
| `PATCH` | `/api/rfq/:id/status` | Update RFQ status |
| `DELETE` | `/api/rfq/:id` | Delete RFQ |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/documents` | Upload document |
| `PUT` | `/api/documents/:id` | Update document |
| `DELETE` | `/api/documents/:id` | Delete document |

---

## ✨ Features

### Frontend Pages
- **Home** – High-conversion hero, stats, features, product categories, testimonials
- **Company Profile** – Business overview, GST/PAN/MSME details, certifications, timeline
- **Government Tenders** – Project portfolio, capability statement, document downloads
- **Product Catalog** – Category filter, search, paginated grid, "Request Quote" per product
- **RFQ Page** – Validated multi-field form with submission confirmation
- **Document Center** – Download / email-request compliance documents
- **Admin Panel** – Dashboard, RFQ management, product CRUD, project CRUD, document uploads

### Backend
- JWT authentication with bcrypt password hashing
- Automatic lead scoring on RFQ submission (quantity + urgency + company)
- Email automation (Nodemailer): customer confirmation + admin alert on new RFQ
- Cloudinary file uploads for product images and documents
- Rate limiting: global (200/15min), RFQ (10/hr), auth (10/15min)
- Full CRUD with input validation
- Text search index on products

### SEO & Performance
- Structured data (LocalBusiness schema)
- Meta tags optimised for local hardware supply keywords
- Lazy image loading
- Mobile-first responsive design

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary font | Playfair Display (headings) |
| Body font | Source Sans 3 |
| Navy 800 | `#0f2044` |
| Gold 500 | `#f5c842` |
| Border radius | `rounded-sm` (2px — sharp industrial feel) |

---

## 📞 Business Info (Update Before Launch)

- **Phone:** +91 98765 43210
- **Email:** info@kuberagencies.com
- **Address:** Madambakkam, Chennai – 600126
- **GST:** Update in `index.html` structured data + Footer
- **WhatsApp:** Update `VITE_WHATSAPP_NUMBER` in `.env`
