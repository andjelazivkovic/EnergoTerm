import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TemperatureLineChart = ({ data = [], title, lineKeys }) => {
  return (
    <div>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={320} >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'white' }}
            tickFormatter={(date) => new Date(date).getDate()} 
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tick={{ fill: 'white' }}
            tickFormatter={(value) => value.toFixed(2)} 
            interval={0}
          />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend />
          {lineKeys.map(({ dataKey, color, name }) => (
            <Line key={dataKey} type="monotone" dataKey={dataKey} stroke={color} name={name} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureLineChart;
