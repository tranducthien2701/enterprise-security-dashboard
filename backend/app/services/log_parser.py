import win32evtlog
import datetime

class WindowsEventMonitor:
    def __init__(self, server="localhost", log_type="Security"):
        self.server = server
        self.log_type = log_type
        # Lưu lại Record Number cuối cùng để không gửi trùng log cũ
        self.last_record_number = None 
        
        # Bộ Rule tự build: Ánh xạ Event ID sang Mức độ cảnh báo (Level)
        self.RULES = {
            4625: {"level": 10, "desc": "🚨 Cảnh báo: Đăng nhập thất bại (Có thể là Brute Force)"},
            4624: {"level": 3,  "desc": "✅ Đăng nhập thành công"},
            4672: {"level": 8,  "desc": "⚠️ Quyền Admin vừa được cấp cho một phiên đăng nhập"},
            4688: {"level": 5,  "desc": "⚙️ Một Process mới vừa được tạo khởi tạo"},
            4720: {"level": 9,  "desc": "👤 Cảnh báo: Một User account mới vừa được tạo"},
            1102: {"level": 12, "desc": "🔥 NGHIÊM TRỌNG: Lịch sử log vừa bị xóa (Clear Log)!"}
        }

    def get_new_events(self):
        """Đọc log mới nhất từ Windows Event Viewer"""
        events_to_send = []
        try:
            # Mở kết nối đến Event Log
            hand = win32evtlog.OpenEventLog(self.server, self.log_type)
            flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
            
            # Đọc các event (lấy một cụm nhỏ)
            events = win32evtlog.ReadEventLog(hand, flags, 0)
            
            if events:
                for event in events:
                    # Lấy ID thực tế của Windows (bỏ qua các bit dư thừa)
                    event_id = event.EventID & 0xFFFF 
                    record_num = event.RecordNumber
                    
                    # Khởi tạo mốc log ban đầu nếu mới chạy
                    if self.last_record_number is None:
                        self.last_record_number = record_num
                        return [] # Bỏ qua các log cũ, chỉ rình log từ thời điểm này trở đi
                    
                    # Chỉ lấy những log mới hơn log cuối cùng đã đọc
                    if record_num > self.last_record_number:
                        if event_id in self.RULES:
                            rule = self.RULES[event_id]
                            events_to_send.append({
                                "id": f"win-{record_num}",
                                "timestamp": event.TimeGenerated.isoformat(),
                                "rule_id": event_id,
                                "level": rule["level"],
                                "description": rule["desc"],
                                "agent": self.server
                            })
                
                # Cập nhật lại mốc log mới nhất
                if events_to_send:
                    # Vì đọc ngược (mới nhất lên trước), mốc cập nhật là record lớn nhất
                    self.last_record_number = max(e["id"].split("-")[1] for e in events_to_send)
                    self.last_record_number = int(self.last_record_number)

            win32evtlog.CloseEventLog(hand)
            
        except Exception as e:
            print(f"Lỗi đọc Windows Log (Nhớ chạy cmd bằng Quyền Admin): {e}")
            
        return events_to_send

# Khởi tạo instance
windows_monitor = WindowsEventMonitor()