import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const ThreatChart = ({ alerts }) => {
    const processData = () => {
        const counts = { 'Info/Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
        
        alerts.forEach(alert => {
            const lvl = alert.level || 0;
            if (lvl <= 4) counts['Info/Low']++;
            else if (lvl <= 7) counts['Medium']++;
            else if (lvl <= 11) counts['High']++;
            else counts['Critical']++;
        });

        return [
            { name: 'Info/Low', count: counts['Info/Low'], color: '#10b981' }, // Emerald green
            { name: 'Medium', count: counts['Medium'], color: '#f59e0b' },     // Amber
            { name: 'High', count: counts['High'], color: '#f97316' },         // Orange
            { name: 'Critical', count: counts['Critical'], color: '#ef4444' }  // Red
        ];
    };

    const data = processData();

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <h3 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600' }}>
                Severity Distribution
            </h3>
            <div style={{ height: 'calc(100% - 45px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                            cursor={{ fill: '#334155', opacity: 0.4 }} 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} 
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ThreatChart;