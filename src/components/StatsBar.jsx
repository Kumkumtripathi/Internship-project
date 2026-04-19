import {
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineTrophy,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import './StatsBar.css';

export default function StatsBar({ stats }) {
  const statCards = [
    {
      key: 'total',
      label: 'Jobs Applied',
      icon: HiOutlineBriefcase,
      colorClass: 'stat--total',
      trend: stats.thisWeekVariance > 0 ? `+${stats.thisWeekVariance} new` : `${stats.thisWeekVariance} new`,
      trendClass: stats.thisWeekVariance >= 0 ? 'trend--positive' : 'trend--negative',
    },
    {
      key: 'interviews',
      label: 'Interviews',
      icon: HiOutlineChatBubbleLeftRight,
      colorClass: 'stat--interview',
      trend: stats.interviews > 0 ? 'In Progress' : 'Upcoming',
      trendClass: stats.interviews > 0 ? 'trend--positive' : 'trend--negative',
    },
    {
      key: 'offers',
      label: 'Offer Letter',
      icon: HiOutlineTrophy,
      colorClass: 'stat--offer',
      trend: (stats.offersThisWeek || 0) > 0 ? 'Success!' : 'Keep going',
      trendClass: (stats.offersThisWeek || 0) > 0 ? 'trend--positive' : 'trend--negative',
    },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: HiOutlineXCircle,
      colorClass: 'stat--rejected',
      trend: `${stats.rejected || 0} total`,
      trendClass: 'trend--negative',
    },
  ];

  return (
    <section className="stats-bar" id="stats-section" aria-label="Application statistics">
      <div className="stats-bar__grid">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`stat-card ${card.colorClass}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="stat-card__top">
                <div className="stat-card__icon">
                  <Icon />
                </div>
                <div className={`stat-card__trend ${card.trendClass}`}>
                  {card.trend}
                </div>
              </div>
              <div className="stat-card__content">
                <span className="stat-card__value mono">{stats[card.key]}</span>
                <span className="stat-card__label">{card.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
