import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const EnergyPieChart = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF5F6D', '#FFD700', '#40E0D0', '#8A2BE2', '#D2691E'];


  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default EnergyPieChart;
