---

### 2. File `security-rules.md` (Đặc tả chi tiết các Rule)

```markdown
# 📜 Security Alert Rules Specification

Tài liệu này đặc tả chi tiết các quy tắc (Rules) mà hệ thống sử dụng để phân tích Windows Event Logs và chuyển đổi chúng thành các cảnh báo trên Dashboard.

## 1. Cơ chế hoạt động
Hệ thống giám sát file `C:\Windows\System32\winevt\Logs\Security.evtx` theo thời gian thực. Khi một sự kiện mới phát sinh, hệ thống sẽ đối chiếu `Event ID` với bảng quy tắc dưới đây.

## 2. Danh mục quy tắc (Rule Catalog)

| Event ID | Mức độ | Tên sự kiện | Mô tả chi tiết & Hành động |
| :--- | :--- | :--- | :--- |
| **4625** | **10** (Critical) | Logon Failure | Người dùng nhập sai mật khẩu. Nhiều event liên tiếp ám chỉ tấn công Brute Force. |
| **1102** | **12** (Critical) | Audit Log Cleared | Nhật ký bảo mật bị xóa. Đây là hành vi điển hình của kẻ tấn công để xóa dấu vết. |
| **4720** | **9** (High) | User Account Created | Một tài khoản mới được tạo. Cần kiểm tra xem có phải do Admin thực hiện hay không. |
| **4672** | **8** (High) | Special Privileges | Một user vừa đăng nhập với quyền Admin/System. |
| **4688** | **5** (Medium) | Process Created | Một tiến trình (app) mới được chạy. Dùng để theo dõi hành vi thực thi mã độc. |
| **4624** | **3** (Low) | Logon Success | Đăng nhập thành công. Theo dõi để biết ai đang truy cập hệ thống. |

## 3. Phân loại mức độ (Severity Mapping)
* **Level 1-4 (Info/Low):** Các hoạt động thông thường, mang tính chất theo dõi.
* **Level 5-7 (Medium):** Các thay đổi cấu hình hoặc thực thi phần mềm cần lưu ý.
* **Level 8-11 (High):** Các hành vi nguy hiểm hoặc thay đổi đặc quyền hệ thống.
* **Level 12+ (Critical):** Các hành động phá hoại trực tiếp hoặc tấn công xâm nhập rõ rệt.

## 4. Cấu hình kỹ thuật
Các quy tắc này được định nghĩa trong class `WindowsEventMonitor` tại file `backend/app/services/log_parser.py`.