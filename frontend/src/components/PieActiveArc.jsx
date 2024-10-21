import * as React from 'react';
import { PieChart } from '@mui/x-charts';

export default function PieActiveArc({ data }) {

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PieChart
        series={[
          {
            data,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter: (item) => `${item.name}: ${item.value}%`,
          },
        ]}
        height={200}
      />
      <div style={{width:'250px', color:'white'}}>
        {data.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: item.color,
                marginRight: '8px',
              }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
