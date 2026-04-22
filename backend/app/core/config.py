import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Enterprise Security Dashboard"
    WAZUH_API_URL: str = os.getenv("WAZUH_API_URL", "https://localhost:55000")
    WAZUH_USER: str = os.getenv("WAZUH_USER", "wazuh-wui")
    WAZUH_PASSWORD: str = os.getenv("WAZUH_PASSWORD", "wazuh")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key")

settings = Settings()