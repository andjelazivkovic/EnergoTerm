import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AreaChartComponent = ({ data }) => {
    
    console.log(data);
    const groupDataByDate = (data) => {
        const groupedData = {};

        data.forEach(item => {
            const date = new Date(item.datetime).toLocaleDateString(); 
            if (!groupedData[date]) {
                groupedData[date] = { datetime: item.datetime, e: item.e }; 
            } else {
                groupedData[date].e = Math.max(groupedData[date].e, item.e);
            }
        });

        return Object.values(groupedData);
    };

    const uniqueData = groupDataByDate(data); 

    const formatXAxisTick = (tick) => {
        const date = new Date(tick);
        return isNaN(date.getTime()) ? tick : date.getDate();
    };

    return (
        <AreaChart
            width={600}
            height={300}
            data={uniqueData.length > 0 ? uniqueData : [{ datetime: 'Nema podataka', e: 0 }]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="datetime"
                tickFormatter={formatXAxisTick}
                tick={{ fill: 'white' }}
                label={{ value: 'Dani u mesecu', position: 'insideBottom', offset: -5, fill: 'white' }}
            />
            <YAxis tick={{ fill: 'white' }} label={{ value: 'Predata energija (kWh)', dx: -20, dy: 80, angle: -90, position: 'insideLeft', fill: 'white' }} />
            <Tooltip
                labelFormatter={(label) => {
                    const date = new Date(label);
                    return isNaN(date.getTime()) ? label : date.toLocaleString();
                }}
            />
            <Area type="monotone" dataKey="e" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
    );
};

export default AreaChartComponent;
