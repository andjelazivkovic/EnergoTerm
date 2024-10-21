import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const months = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
];

const BarChartComponent = ({ data, selectedMonth }) => {

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                    <p>{`Lokacija: ${payload[0].payload.location}`}</p> 
                    <p>{`Potrošnja: ${payload[0].payload.total_energy_mwh} MWh`}</p> 
                </div>
            );
        }
        return null;
    };

    
    const CustomLegend = (props) => {
        const { payload } = props; 
        return (
            <div style={{ textAlign: 'center' }}> 
                {payload.map((entry, index) => (
                    <span key={`item-${index}`} style={{ color: 'white', display: 'inline-block', marginRight: 10 }}>
                        <svg width="14" height="14" style={{ marginRight: 5 }}>
                            <rect width="14" height="14" fill={entry.color || '#82ca9d'} /> 
                        </svg>
                        {`Potrošnja energija za mesec ${months[selectedMonth - 1]}`}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <BarChart data={data} width={600} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" tick={{ fill: 'white' }} /> 
            <YAxis label={{ value: 'Potrošena energija (MWh)', dx: -20, dy:80, angle: -90, position: 'insideLeft', fill: 'white' }} tick={{ fill: 'white' }} />
            <Tooltip content={<CustomTooltip />} /> 
            <Legend content={<CustomLegend />} /> 
            <Bar dataKey="total_energy_mwh" fill="#82ca9d" />
        </BarChart>
    );
};

export default BarChartComponent;
