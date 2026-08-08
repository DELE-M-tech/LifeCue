export function SkelBlock({ width = '100%', height = '1rem', radius = 'var(--radius-sm)', style = {} }) {
  return <div className="skel-block" style={{ width, height, borderRadius: radius, ...style }} />;
}

export function SkelCard({ children, padding = '1.5rem' }) {
  return <div className="dash-card" style={{ padding }}>{children}</div>;
}

export function SkelRow() {
  return (
    <div className="skel-row">
      <SkelBlock width="7px" height="7px" radius="50%" />
      <div style={{ flex: 1 }}>
        <SkelBlock width="40%" height="0.85rem" style={{ marginBottom: '0.4rem' }} />
        <SkelBlock width="60%" height="0.7rem" />
      </div>
      <SkelBlock width="3rem" height="1.5rem" radius="9999px" />
    </div>
  );
}

export function SkelStatCard() {
  return (
    <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <SkelBlock width="2.5rem" height="2.5rem" radius="var(--radius-sm)" />
      <SkelBlock width="3rem" height="1.75rem" />
      <SkelBlock width="70%" height="0.75rem" />
    </div>
  );
}

export function SkelTopbar() {
  return (
    <div className="dash-topbar">
      <div>
        <SkelBlock width="220px" height="1.6rem" style={{ marginBottom: '0.5rem' }} />
        <SkelBlock width="160px" height="0.85rem" />
      </div>
      <SkelBlock width="90px" height="3rem" radius="var(--radius-lg)" />
    </div>
  );
}
