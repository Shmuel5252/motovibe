import React from "react";
import GlassCard from "../../app/ui/components/GlassCard.jsx";
import StatStrip from "../../app/ui/components/StatStrip.jsx";
import ButtonPrimary from "../../app/ui/components/ButtonPrimary.jsx";

export default function Bike() {
  return (
    <div className="mv-page">
      <div className="mv-page__title">
        <h1 className="mv-h1">Garage</h1>
        <p className="mv-subtitle">Your bike, maintenance, and logs (UI only).</p>
      </div>

      <GlassCard
        title="My Bike"
        subtitle="Profile"
        right={<span className="mv-badge mv-badge--teal">Bike</span>}
      >
        <div className="mv-garagePage__hero">
          <div className="mv-bikeImg mv-bikeImg--big" aria-hidden="true">
            <div className="mv-bikeImg__shine" />
          </div>

          <div className="mv-garagePage__meta">
            <div className="mv-garage__name">Yamaha MT-07</div>
            <div className="mv-muted">Year: <b>2021</b></div>
            <div className="mv-muted">Odometer: <b>18,420 km</b></div>
            <div className="mv-muted">Next service: <b>+580 km</b></div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <StatStrip
            items={[
              { icon: "📍", value: "18,420 km", label: "Total km" },
              { icon: "⏱️", value: "86h", label: "Ride time" },
              { icon: "🧾", value: "12", label: "Logs" },
            ]}
          />
        </div>

        <div className="mv-garagePage__actions">
          <ButtonPrimary disabled>Add maintenance log</ButtonPrimary>
          <button className="mv-btn mv-btn--ghost" disabled>
            Edit bike
          </button>
        </div>
      </GlassCard>

      <div className="mv-section">
        <h2 className="mv-h2">Maintenance Alerts</h2>

        <div className="mv-grid">
          <GlassCard title="Oil" subtitle="Due soon" right={<span className="mv-badge mv-badge--teal">+580 km</span>}>
            <div className="mv-muted">Recommended: every 5,000–6,000 km</div>
          </GlassCard>

          <GlassCard title="Chain" subtitle="OK" right={<span className="mv-badge mv-badge--soft">Normal</span>}>
            <div className="mv-muted">Check tension and lubrication</div>
          </GlassCard>

          <GlassCard title="Tires" subtitle="Monitor" right={<span className="mv-badge mv-badge--soft">Soon</span>}>
            <div className="mv-muted">Pressure + wear inspection</div>
          </GlassCard>
        </div>
      </div>

      <div className="mv-section">
        <h2 className="mv-h2">Recent Logs</h2>

        <div className="mv-grid">
          {[
            { title: "Oil change", meta: "17,800 km · ₪280 · 2 weeks ago" },
            { title: "Chain lube", meta: "18,200 km · ₪40 · 5 days ago" },
            { title: "Tire pressure", meta: "18,350 km · — · yesterday" },
          ].map((x) => (
            <GlassCard key={x.title} className="mv-logCard">
              <div className="mv-logCard__title">{x.title}</div>
              <div className="mv-muted" style={{ fontSize: 12, marginTop: 4 }}>{x.meta}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard title="Note" subtitle="Next step">
        <div className="mv-muted">
          This page is UI-ready. We will connect it after we add:
          <b> /bike route + bikes CRUD + maintenance alerts</b>.
        </div>
      </GlassCard>
    </div>
  );
}
