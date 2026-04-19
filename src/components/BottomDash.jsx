import { useMemo } from 'react';
import './BottomDash.css';

export default function BottomDash({ stats }) {
  const chartBars = stats.chartBars || [0, 0, 0, 0, 0, 0, 0];
  const maxBarHeight = Math.max(...chartBars, 1); // Avoid division by zero
  
  const progressBars = [
    { label: 'Applied', value: stats.applied, color: '#6386ff' },
    { label: 'Interviews', value: stats.interviews, color: '#f5a623' },
    { label: 'Offers', value: stats.offers, color: '#34d399' },
    { label: 'Rejected', value: stats.rejected, color: '#f87171' },
  ];

  // Generate labels for the last 7 days
  const dayLabels = useMemo(() => {
    const labels = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(days[d.getDay()]);
    }
    return labels;
  }, []);

  return (
    <div className="bottom-dash">
      <div className="bottom-dash__card">
        <h3 className="bottom-dash__title">Applications this week</h3>
        <div className="bar-chart">
          {chartBars.map((h, i) => (
            <div key={i} className="bar-chart__item">
              <div 
                className="bar-chart__bar" 
                style={{ height: `${(h / maxBarHeight) * 100}%` }}
                title={`${h} applications`}
              ></div>
              <span className="bar-chart__label">{dayLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-dash__card">
        <h3 className="bottom-dash__title">Status breakdown</h3>
        <div className="status-bars">
          {progressBars.map((pb) => (
            <div key={pb.label} className="status-row">
              <span className="status-row__label">{pb.label}</span>
              <div className="status-row__track">
                <div 
                  className="status-row__fill" 
                  style={{ width: `${(pb.value / (stats.total || 1)) * 100}%`, backgroundColor: pb.color }}
                ></div>
              </div>
              <span className="status-row__value">{pb.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
