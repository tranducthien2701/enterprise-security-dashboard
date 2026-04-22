import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
    const [alerts, setAlerts] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const newAlert = JSON.parse(event.data);
            // Thêm cảnh báo mới vào đầu danh sách
            setAlerts((prev) => [newAlert, ...prev].slice(0, 100)); // Giữ tối đa 100 log
        };

        ws.current.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsConnected(false);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url]);

    return { alerts, isConnected };
};