# 🛡️ Enterprise Security Dashboard (Mini-SIEM)

Một hệ thống giám sát an ninh mạng (SIEM) thu nhỏ, cho phép đọc, phân tích và hiển thị cảnh báo từ Windows Event Logs theo thời gian thực (Real-time) thông qua WebSockets.

Dự án này được xây dựng với kiến trúc Microservices cơ bản, phân tách rõ ràng giữa Backend (Xử lý Log, API) và Frontend (Giao diện trực quan hóa dữ liệu).

## ✨ Tính năng nổi bật

* **Real-time Log Ingestion:** Tự động giám sát và bóc tách dữ liệu trực tiếp từ Windows Security Event Logs.
* **Rule-based Alerting:** Tích hợp bộ quy tắc (Rules) tự định nghĩa để phân loại mức độ đe dọa (Brute force, Tạo user trái phép, Xóa log...).
* **WebSocket Streaming:** Đẩy dữ liệu cảnh báo từ Backend xuống Frontend ngay lập tức mà không cần F5/Reload trang.
* **Threat Visualization:** Biểu đồ tương tác phân tích mức độ nghiêm trọng của các cuộc tấn công.
* **Zero-Config SIEM:** Hoạt động độc lập bằng Python Native, cực kỳ nhẹ bén, không yêu cầu cài đặt các hệ thống cồng kềnh như Elasticsearch hay Wazuh.

## 🛠️ Công nghệ sử dụng

**Backend (Core & API):**
* [Python 3.10+](https://www.python.org/)
* [FastAPI](https://fastapi.tiangolo.com/) (Web Framework tốc độ cao)
* [WebSockets](https://websockets.readthedocs.io/en/stable/) (Giao tiếp Real-time)
* `pywin32` (Giao tiếp với Windows API)

**Frontend (UI/UX):**
* [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Hiệu năng build)
* [Recharts](https://recharts.org/) (Vẽ biểu đồ dữ liệu)
* [Lucide React](https://lucide.dev/) (Hệ thống Icon)

---

## BACKEND
# Di chuyển vào thư mục backend
cd backend

# Tạo và kích hoạt môi trường ảo
python -m venv venv
venv\Scripts\activate

# Cài đặt thư viện
pip install -r requirements.txt

# Khởi động server
uvicorn main:app --reload --port 8000



## FRONTEND
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện (chỉ cần chạy lần đầu)
npm install

# Khởi động giao diện
npm run dev




## 📂 Cấu trúc thư mục

```text
enterprise-security-dashboard/
├── backend/                        # Xử lý logic và kết nối Windows API
│   ├── app/
│   │   ├── api/routes.py           # API Endpoints
│   │   ├── core/config.py          # Cấu hình biến môi trường
│   │   ├── services/log_parser.py  # Mini-SIEM bóc tách Windows Event Log
│   │   └── websockets/stream.py    # Quản lý luồng WebSocket
│   ├── main.py                     # Entry-point của FastAPI Server
│   └── requirements.txt            # Danh sách thư viện Python
│
├── frontend/                       # Giao diện người dùng
│   ├── src/
│   │   ├── components/charts/      # Component biểu đồ đe dọa
│   │   ├── hooks/useWebSocket.js   # Custom hook xử lý kết nối realtime
│   │   ├── pages/Dashboard.jsx     # Trang chủ hiển thị tổng quan
│   │   └── App.jsx
│   ├── package.json                # Danh sách thư viện Node.js
│   └── vite.config.js              # Cấu hình Vite & Proxy
│
└── README.md                       # Tài liệu dự án