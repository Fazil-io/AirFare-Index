# VayuSuchak (वायुसूचक)
### Real-Time Airfare Intelligence Platform & High-Frequency CPI Augmentation System
**Ministry of Statistics and Programme Implementation (MoSPI) • Government of India**

---

## 📌 Executive Summary

**VayuSuchak (वायुसूचक)** is a real-time airfare monitoring, statistical normalization, and price indexation platform designed to augment the transport group of the official **Consumer Price Index (CPI)**. By transitioning from traditional, labor-intensive manual ticket quotation collection to high-frequency automated extraction, dynamic yield curve normalization, and econometric index modeling, VayuSuchak provides high-frequency airfare intelligence with audit-ready transparency.

---

## 🏛️ System Architecture

```
                                  ┌───────────────────────────────┐
                                  │      Public OTA & Carrier     │
                                  │     Aggregators & Scrapers    │
                                  └──────────────┬────────────────┘
                                                 │ (Raw quotes, T-0 to T-30+)
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VayuSuchak Backend Core                               │
│                                                                                 │
│   ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐  │
│   │ Normalization & Fare │    │   Anomaly Detector   │    │  Index Engine    │  │
│   │  Breakdown Pipeline  │───▶│  (Z-Score + IQR +    │───▶│ (Fisher Ideal,   │  │
│   │ (Base, Taxes, Fees)  │    │      MAD Fences)     │    │ Laspeyres, Torn) │  │
│   └──────────────────────┘    └──────────────────────┘    └──────────────────┘  │
│                                           │                                     │
│                                           ▼                                     │
│                               ┌──────────────────────┐                          │
│                               │  Append-Only Audit   │                          │
│                               │  Trail (SHA-256)     │                          │
│                               └──────────────────────┘                          │
│                                           │                                     │
│                                           ▼                                     │
│                               ┌──────────────────────┐                          │
│                               │ SQLite 3 / SQLAlchemy│                          │
│                               │(airfare_intelligence)│                          │
│                               └──────────────────────┘                          │
└───────────────────────────────────────────┬─────────────────────────────────────┘
                                            │ REST API (/api/v1)
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      VayuSuchak Frontend (React + Vite)                         │
│                                                                                 │
│  • National & Route Inflation Indices                                           │
│  • High-Frequency Yield Curves (T-0 to T-30+ Lead Time Buckets)                 │
│  • Real-Time Anomaly Adjudication & Statistical Triage                          │
│  • MoSPI Official Press Release & Annexure Export                               │
│  • Immutable Cryptographic Audit Log Explorer                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **Automated OTA & Airline Scraper Pipeline:** Multi-adapter real-time ingestion (MakeMyTrip, EaseMyTrip, IndiGo Direct) tracking metro-metro, metro-nonmetro, and regional UDAN corridors across departure windows ($T-0$ to $T-30+$ days).
- **Non-Destructive Statistical Anomaly Triage:** Multi-detector anomaly scoring combining modified Z-Score, Interquartile Range (IQR), and Median Absolute Deviation (MAD). Flagged fares undergo officer review before index inclusion.
- **Index Calculation Engine:** Computes elementary route aggregates (Jevons geometric mean, Carli arithmetic mean, Dutot ratio of averages) aggregated into national indices using Laspeyres, Paasche, and Fisher Ideal superlative formulas.
- **DGCA & NSSO Dynamic Route Weighting:** Calibrated against official DGCA city-pair quarterly traffic reports and NSSO Table 7 expenditure shares.
- **Cryptographic Audit Lineage:** Every data ingestion, calculation run, and officer review is hashed (SHA-256) into an immutable audit trail table.
- **MoSPI Official Reporting:** Pre-formatted exports matching official MoSPI CPI Press Release Annexures I-IV.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python 3.12, FastAPI, SQLAlchemy ORM, Uvicorn, APScheduler
- **Database:** SQLite 3 (`airfare_intelligence.db`)
- **Scraper Stack:** Playwright (Chromium headless), HTTPX async client, BeautifulSoup4
- **Statistical Analytics:** NumPy, SciPy, Pandas

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/Arshu168/VayuSuchak.git
cd VayuSuchak
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy playwright httpx apscheduler numpy scipy pandas

# Launch FastAPI server (runs on http://127.0.0.1:8000)
PYTHONPATH=. uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
# Install NPM packages
npm install

# Start Vite dev server (runs on http://localhost:5174)
npm run dev -- --port 5174
```

### 4. Access the Application
Open your browser at [http://localhost:5174](http://localhost:5174) to view the VayuSuchak Airfare Intelligence Dashboard.

---

## 📜 License & Acknowledgments
Built for the **Ministry of Statistics and Programme Implementation (MoSPI)** for CPI modernisation and smart automation.
