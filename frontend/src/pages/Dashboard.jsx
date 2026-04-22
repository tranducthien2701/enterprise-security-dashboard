import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import ThreatChart from '../components/charts/ThreatChart';
import { ShieldAlert, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
    const { alerts, isConnected } = useWebSocket('ws://localhost:8000/ws/alerts');

    // Tính toán số liệu cho thẻ KPI
    const totalEvents = alerts.length;
    const criticalEvents = alerts.filter(a => a.level >= 10).length;
    const latestEventTime = alerts.length > 0 ? new Date(alerts[0].timestamp).toLocaleTimeString() : '--:--:--';

    // Bảng màu chuẩn SIEM
    const colors = {
        bg: '#020617',         // Very dark slate
        cardBg: '#0f172a',     // Dark slate
        border: '#1e293b',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        critical: '#ef4444',
        high: '#f97316',
        medium: '#f59e0b',
        low: '#10b981'
    };

    const getLevelColor = (level) => {
        if (level >= 10) return { bg: 'rgba(239, 68, 68, 0.2)', text: colors.critical };
        if (level >= 8) return { bg: 'rgba(249, 115, 22, 0.2)', text: colors.high };
        if (level >= 5) return { bg: 'rgba(245, 158, 11, 0.2)', text: colors.medium };
        return { bg: 'rgba(16, 185, 129, 0.2)', text: colors.low };
    };

    // Component thẻ KPI nhỏ gọn
    const StatCard = ({ icon, title, value, color }) => (
        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ backgroundColor: `${color}20`, padding: '12px', borderRadius: '10px', color: color, display: 'flex' }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, color: colors.textMuted, fontSize: '0.875rem', fontWeight: '500' }}>{title}</p>
                <h3 style={{ margin: '4px 0 0 0', color: colors.text, fontSize: '1.5rem', fontWeight: '700' }}>{value}</h3>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '24px 32px', fontFamily: '"Inter", system-ui, sans-serif', backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
                        <ShieldAlert color="#38bdf8" size={36} /> 
                        Enterprise SOC Dashboard
                    </h1>
                    <p style={{ margin: '8px 0 0 0', color: colors.textMuted, fontSize: '0.9rem' }}>Real-time Windows Event Log Analysis</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isConnected ? colors.low : colors.critical, boxShadow: `0 0 8px ${isConnected ? colors.low : colors.critical}` }}></div>
                    <span style={{ color: isConnected ? colors.low : colors.critical, fontWeight: '600', fontSize: '0.875rem' }}>
                        {isConnected ? 'System Live' : 'Connection Lost'}
                    </span>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <StatCard icon={<Activity size={28} />} title="Total Events (Session)" value={totalEvents} color="#38bdf8" />
                <StatCard icon={<AlertTriangle size={28} />} title="Critical Threats" value={criticalEvents} color={colors.critical} />
                <StatCard icon={<ShieldCheck size={28} />} title="Active Agents" value="1 (Localhost)" color={colors.low} />
                <StatCard icon={<Activity size={28} />} title="Latest Event" value={latestEventTime} color={colors.medium} />
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px' }}>
                
                {/* Cột trái: Biểu đồ */}
                <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '24px', height: '400px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <ThreatChart alerts={alerts} />
                </div>

                {/* Cột phải: Bảng Log Realtime */}
                <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}` }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Recent Threat Activity</h3>
                    </div>
                    
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', position: 'sticky', top: 0, zIndex: 10 }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', color: colors.textMuted, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                                    <th style={{ padding: '16px 24px', color: colors.textMuted, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agent</th>
                                    <th style={{ padding: '16px 24px', color: colors.textMuted, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Severity</th>
                                    <th style={{ padding: '16px 24px', color: colors.textMuted, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>No recent threats detected.</td>
                                    </tr>
                                ) : (
                                    alerts.map((alert, i) => {
                                        const levelStyle = getLevelColor(alert.level);
                                        return (
                                            <tr key={alert.id || i} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: colors.textMuted, fontFamily: 'monospace' }}>
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{alert.agent}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{ 
                                                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700',
                                                        backgroundColor: levelStyle.bg, color: levelStyle.text, border: `1px solid ${levelStyle.text}40`
                                                    }}>
                                                        LVL {alert.level}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.95rem' }}>{alert.description}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;