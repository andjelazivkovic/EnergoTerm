import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const formatDate = (datetime) => {
  const date = new Date(datetime);
  
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`; 
};

const PrimSecTempLineChart = ({ data, dataKeySup, dataKeyRet, title }) => {
  console.log("Chart Data:", data); 
  return (
    <div>
      <h3 style={{ color: 'white', textAlign: 'center' }}>{title}</h3>
      <ResponsiveContainer width={500} height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="datetime" 
              tickFormatter={formatDate}
              angle={-45} 
              tick={{ fill: 'white' }}
              textAnchor="end" 
              domain={['dataMin', 'dataMax']} 
              tickCount={data.length}
            />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip  />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            <Line type="monotone" dataKey={dataKeySup} stroke="#8884d8" name="T Supply" />
            <Line type="monotone" dataKey={dataKeyRet} stroke="#82ca9d" name="T Return" />
          </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrimSecTempLineChart;
