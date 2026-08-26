import React from 'react';
import Icon from '../ui/Icon';

export default function ClassSelector({ groups, selectedGroupId }) {
  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  return (
    <div className="animate-fade-in" style={{ padding: '0.85rem 1rem', background: 'var(--bg-row)', borderBottom: '1px solid var(--border-light)' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
        {currentGroup.grade}{currentGroup.group} — {currentGroup.subject}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
        <Icon name="clock" size={12} /> {currentGroup.schedule}
      </div>
    </div>
  );
}
