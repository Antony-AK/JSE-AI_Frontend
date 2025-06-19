// Install these dependencies before running:
// npm install recharts

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', applications: 26 },
  { month: 'Feb', applications: 20 },
  { month: 'Mar', applications: 14 },
  { month: 'Apr', applications: 35 },
  { month: 'May', applications: 15 },
  { month: 'Jun', applications: 58 },
  { month: 'Jul', applications: 32 },
  { month: 'Aug', applications: 29 },
  { month: 'Sep', applications: 10 },
  { month: 'Oct', applications: 95 },
  { month: 'Nov', applications: 92 },
  { month: 'Dec', applications: 87 }
];

const ApplicationsChart = () => {
  return (
    <div className="w-[75%] h-[450px] bg-white rounded-xl p-6 relative justify-center items-center mx-auto mt-20 ">
      <h2 className="text-center text-xl font-semibold text-black mb-5">
        Applications Submitted per Month
      </h2>

      {/* Close button */}
      <button className="absolute top-3 right-4 text-4xl font-medium text-black">&times;</button>

      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: '#000' }} />
          <YAxis tick={{ fill: '#000' }} domain={[0, 100]} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="applications"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorApp)"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationsChart;