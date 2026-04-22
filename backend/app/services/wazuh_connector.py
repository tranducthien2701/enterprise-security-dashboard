import requests
import urllib3
from app.core.config import settings

# Tắt cảnh báo SSL cho môi trường lab/nội bộ
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class WazuhConnector:
    def __init__(self):
        self.base_url = settings.WAZUH_API_URL
        self.user = settings.WAZUH_USER
        self.password = settings.WAZUH_PASSWORD
        self.token = None

    def authenticate(self):
        """Lấy JWT token từ Wazuh API"""
        auth_url = f"{self.base_url}/security/user/authenticate"
        try:
            response = requests.get(auth_url, auth=(self.user, self.password), verify=False)
            response.raise_for_status()
            self.token = response.json()['data']['token']
            return True
        except Exception as e:
            print(f"Lỗi xác thực Wazuh: {e}")
            return False

    def get_recent_alerts(self, limit=10):
        """Lấy các cảnh báo mới nhất"""
        if not self.token:
            if not self.authenticate():
                return []

        headers = {'Authorization': f'Bearer {self.token}'}
        alerts_url = f"{self.base_url}/security/alerts?limit={limit}&sort=-timestamp"
        
        try:
            response = requests.get(alerts_url, headers=headers, verify=False)
            response.raise_for_status()
            return response.json()['data']['affected_items']
        except requests.exceptions.HTTPError as err:
            if response.status_code == 401: # Token hết hạn
                self.token = None 
            print(f"Lỗi lấy alerts: {err}")
            return []

wazuh_service = WazuhConnector()