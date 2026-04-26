import React, { useState, useEffect, useRef } from 'react';
import {
  FiWifi, FiWifiOff, FiBattery, FiMapPin, FiActivity,
  FiShield, FiAlertTriangle, FiCheckCircle, FiPhone,
  FiClock, FiNavigation, FiCpu, FiRadio, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

/* ─── Helpers ─── */
const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/* ─── Mock journey data ─── */
const JOURNEYS = [
  {
    id: 1,
    from: 'Home – Koramangala',
    to: 'Office – HSR Layout',
    duration: '38 min',
    date: 'Today, 09:14 AM',
    status: 'safe',
    stops: ['Silk Board Signal (5 min)', 'Fuel Station'],
    incident: null,
  },
  {
    id: 2,
    from: 'Office – HSR Layout',
    to: 'Phoenix Mall, Whitefield',
    duration: '52 min',
    date: 'Yesterday, 06:45 PM',
    status: 'sos',
    stops: ['Metro Station'],
    incident: 'SOS triggered near Bellandur',
  },
  {
    id: 3,
    from: 'Phoenix Mall',
    to: 'Home – Koramangala',
    duration: '41 min',
    date: 'Yesterday, 09:30 PM',
    status: 'safe',
    stops: [],
    incident: null,
  },
];

const STATUS_MAP = {
  safe: { label: 'Safe', color: '#22c55e', icon: <FiCheckCircle /> },
  sos: { label: 'SOS Triggered', color: '#ef4444', icon: <FiAlertTriangle /> },
  interrupted: { label: 'Interrupted', color: '#f59e0b', icon: <FiAlertTriangle /> },
};

/* ─── Fake-Call modal ─── */
const FakeCallModal = ({ caller, onEnd }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const fmtElapsed = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div className="fakecall-overlay">
      <div className="fakecall-card">
        <div className="fakecall-avatar">{caller.charAt(0).toUpperCase()}</div>
        <div className="fakecall-name">{caller}</div>
        <div className="fakecall-status">Incoming Call • {fmtElapsed}</div>
        <div className="fakecall-wave">
          <span /><span /><span /><span /><span />
        </div>
        <button className="fakecall-end" onClick={onEnd}>
          <FiX /> End Call
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const Dashboard = () => {
  const { triggerSOS, token } = useAuth();
  const now = useNow();

  /* System monitoring */
  const [location, setLocation] = useState(null);
  const [locStatus, setLocStatus] = useState('acquiring');
  const [battery, setBattery] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [motionAlert, setMotionAlert] = useState(false);
  const [aiAlert, setAiAlert] = useState(false);

  /* Journey log */
  const [activeJourney, setActiveJourney] = useState(null);

  /* Fake call */
  const [showFakeCallSetup, setShowFakeCallSetup] = useState(false);
  const [fakeCaller, setFakeCaller] = useState('Mom');
  const [fakeDelay, setFakeDelay] = useState(5);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallCountdown, setFakeCallCountdown] = useState(null);
  const countdownRef = useRef(null);

  /* Check-in */
  const [checkInMsg, setCheckInMsg] = useState('');

  /* GPS */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocStatus('active');
        },
        () => setLocStatus('error')
      );
    } else {
      setLocStatus('unsupported');
    }
  }, []);

  /* Battery */
  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then(b => {
        const update = () => setBattery(Math.round(b.level * 100));
        update();
        b.addEventListener('levelchange', update);
        return () => b.removeEventListener('levelchange', update);
      });
    }
  }, []);

  /* Online/offline */
  useEffect(() => {
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    window.addEventListener('online', onOn);
    window.addEventListener('offline', onOff);
    return () => { window.removeEventListener('online', onOn); window.removeEventListener('offline', onOff); };
  }, []);

  /* Motion detection (devicemotion) */
  useEffect(() => {
    let last = null;
    const handleMotion = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const mag = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
      if (last !== null && Math.abs(mag - last) > 20) setMotionAlert(true);
      last = mag;
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  /* Derived overall status */
  const overallStatus = motionAlert || aiAlert
    ? 'danger'
    : locStatus === 'error' || !online
    ? 'warning'
    : 'safe';

  const overallMeta = {
    safe:    { label: 'All Systems Active',          color: '#22c55e', icon: <FiShield />,        border: '#22c55e33' },
    warning: { label: 'Weak Signal / GPS Issue',     color: '#f59e0b', icon: <FiAlertTriangle />, border: '#f59e0b33' },
    danger:  { label: 'Unusual Activity Detected',  color: '#ef4444', icon: <FiAlertTriangle />, border: '#ef444433' },
  }[overallStatus];

  /* ─── Handlers ─── */
  const handleCheckIn = () => {
    if (!navigator.geolocation) { alert('Geolocation unsupported.'); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      setCheckInMsg(`✅ Check-in sent! Location: ${mapsLink}`);
      setTimeout(() => setCheckInMsg(''), 5000);
    }, () => {
      setCheckInMsg('❌ Could not get location. Please allow GPS access.');
      setTimeout(() => setCheckInMsg(''), 4000);
    });
  };

  const handleStartFakeCall = () => {
    setShowFakeCallSetup(false);
    let remaining = fakeDelay;
    setFakeCallCountdown(remaining);
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setFakeCallCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        setFakeCallCountdown(null);
        setFakeCallActive(true);
      }
    }, 1000);
  };

  const handleEndFakeCall = () => {
    setFakeCallActive(false);
    clearInterval(countdownRef.current);
    setFakeCallCountdown(null);
  };

  /* ─── Render ─── */
  return (
    <div className="db-root">

      {/* Fake Call Modal */}
      {fakeCallActive && <FakeCallModal caller={fakeCaller} onEnd={handleEndFakeCall} />}

      {/* Fake Call Setup Modal */}
      {showFakeCallSetup && (
        <div className="fakecall-overlay">
          <div className="fakecall-setup">
            <h3>📞 Setup Fake Call</h3>
            <label>Caller Name
              <input value={fakeCaller} onChange={e => setFakeCaller(e.target.value)} placeholder="e.g. Mom, Police, Friend" />
            </label>
            <label>Delay
              <div className="delay-opts">
                {[5, 10, 30].map(d => (
                  <button key={d} className={`delay-btn ${fakeDelay === d ? 'active' : ''}`} onClick={() => setFakeDelay(d)}>{d}s</button>
                ))}
              </div>
            </label>
            <div className="setup-actions">
              <button className="btn btn-primary" onClick={handleStartFakeCall}>Start Call in {fakeDelay}s</button>
              <button className="btn outline" onClick={() => setShowFakeCallSetup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Countdown toast */}
      {fakeCallCountdown !== null && (
        <div className="countdown-toast">📞 Fake call ringing in {fakeCallCountdown}s…</div>
      )}

      {/* Check-in toast */}
      {checkInMsg && <div className="checkin-toast">{checkInMsg}</div>}

      {/* ── Header banner ── */}
      <div className="db-banner" style={{ borderColor: overallMeta.color, boxShadow: `0 0 24px ${overallMeta.border}` }}>
        <div className="db-banner-icon" style={{ color: overallMeta.color, background: overallMeta.border }}>
          {overallMeta.icon}
        </div>
        <div className="db-banner-text">
          <h3 style={{ color: overallMeta.color }}>{overallMeta.label.toUpperCase()}</h3>
          <p>InstAlert is actively monitoring your safety. Last scan: {fmt(now)}</p>
        </div>
        <div className="db-clock">{fmt(now)}</div>
      </div>

      {/* ── Grid ── */}
      <div className="db-grid">

        {/* LEFT – Map + Journey Log */}
        <div className="db-left">

          {/* Map */}
          <div className="db-card db-map-card">
            <div className="db-card-header">
              <div className="db-card-title"><FiNavigation /> Live Location</div>
              <span className="db-badge green">● Active</span>
            </div>
            <div className="db-map-wrap">
              {location ? (
                <iframe
                  title="live-map"
                  width="100%" height="100%"
                  style={{ border: 0, borderRadius: '10px' }}
                  src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                />
              ) : (
                <div className="db-map-acquiring">
                  <div className="pulse-ring" />
                  <span>{locStatus === 'error' ? '⚠ GPS Unavailable' : 'Acquiring GPS Signal…'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Journey Log */}
          <div className="db-card">
            <div className="db-card-header">
              <div className="db-card-title"><FiClock /> Recent Journey Log</div>
            </div>
            <div className="journey-list">
              {JOURNEYS.map(j => (
                <div key={j.id} className={`journey-item ${activeJourney === j.id ? 'expanded' : ''}`}>
                  <div className="journey-top" onClick={() => setActiveJourney(activeJourney === j.id ? null : j.id)}>
                    <div className="journey-route">
                      <span className="journey-from">{j.from}</span>
                      <span className="journey-arrow">→</span>
                      <span className="journey-to">{j.to}</span>
                    </div>
                    <div className="journey-meta">
                      <span className="journey-time">{j.date} • {j.duration}</span>
                      <span className="journey-status" style={{ color: STATUS_MAP[j.status].color }}>
                        {STATUS_MAP[j.status].icon} {STATUS_MAP[j.status].label}
                      </span>
                    </div>
                  </div>
                  {activeJourney === j.id && (
                    <div className="journey-detail">
                      {j.stops.length > 0 && (
                        <div className="journey-stops">
                          <strong>Stops:</strong>
                          {j.stops.map((s, i) => <span key={i} className="stop-tag">{s}</span>)}
                        </div>
                      )}
                      {j.incident && (
                        <div className="journey-incident">
                          <FiAlertTriangle style={{ color: '#ef4444' }} /> {j.incident}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT – Monitoring + Quick Actions */}
        <div className="db-right">

          {/* System Monitoring */}
          <div className="db-card">
            <div className="db-card-header">
              <div className="db-card-title"><FiCpu /> System Monitoring</div>
            </div>
            <div className="monitor-grid">
              {/* GPS */}
              <div className={`monitor-item ${locStatus === 'active' ? 'ok' : locStatus === 'acquiring' ? 'warn' : 'err'}`}>
                <FiMapPin className="mon-icon" />
                <div>
                  <div className="mon-label">GPS</div>
                  <div className="mon-val">{locStatus === 'active' ? 'Active' : locStatus === 'acquiring' ? 'Acquiring' : 'Error'}</div>
                </div>
                <div className={`mon-dot ${locStatus === 'active' ? 'green' : locStatus === 'acquiring' ? 'yellow' : 'red'}`} />
              </div>

              {/* Internet */}
              <div className={`monitor-item ${online ? 'ok' : 'err'}`}>
                {online ? <FiWifi className="mon-icon" /> : <FiWifiOff className="mon-icon" />}
                <div>
                  <div className="mon-label">Internet</div>
                  <div className="mon-val">{online ? 'Connected' : 'Offline'}</div>
                </div>
                <div className={`mon-dot ${online ? 'green' : 'red'}`} />
              </div>

              {/* Battery */}
              <div className={`monitor-item ${battery === null ? 'ok' : battery > 30 ? 'ok' : battery > 15 ? 'warn' : 'err'}`}>
                <FiBattery className="mon-icon" />
                <div>
                  <div className="mon-label">Battery</div>
                  <div className="mon-val">{battery !== null ? `${battery}%` : 'Unavailable'}</div>
                </div>
                <div className={`mon-dot ${battery === null ? 'green' : battery > 30 ? 'green' : battery > 15 ? 'yellow' : 'red'}`} />
              </div>

              {/* Motion */}
              <div className={`monitor-item ${motionAlert ? 'err' : 'ok'}`}>
                <FiActivity className="mon-icon" />
                <div>
                  <div className="mon-label">Motion</div>
                  <div className="mon-val">{motionAlert ? 'Unusual Activity' : 'Normal'}</div>
                </div>
                <div className={`mon-dot ${motionAlert ? 'red' : 'green'}`} />
                {motionAlert && <button className="mon-dismiss" onClick={() => setMotionAlert(false)}>✕</button>}
              </div>

              {/* AI Anomaly */}
              <div className={`monitor-item ${aiAlert ? 'err' : 'ok'} full-width`}>
                <FiRadio className="mon-icon" />
                <div>
                  <div className="mon-label">AI Anomaly Detection</div>
                  <div className="mon-val">{aiAlert ? '⚠ Route Deviation / Unusual Stop' : 'No anomalies detected'}</div>
                </div>
                <div className={`mon-dot ${aiAlert ? 'red' : 'green'}`} />
                {aiAlert && <button className="mon-dismiss" onClick={() => setAiAlert(false)}>✕</button>}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="db-card qa-card">
            <div className="db-card-header">
              <div className="db-card-title"><FiShield /> Quick Actions</div>
            </div>

            {/* Check-in */}
            <div className="qa-block">
              <div className="qa-info">
                <FiMapPin className="qa-icon green-icon" />
                <div>
                  <h5>Check-in Now</h5>
                  <p>Send your live location & safety status to all trusted contacts instantly.</p>
                </div>
              </div>
              <button className="btn qa-btn qa-btn-green" onClick={handleCheckIn}>
                <FiCheckCircle /> Send Check-in
              </button>
            </div>

            {/* Fake Call */}
            <div className="qa-block">
              <div className="qa-info">
                <FiPhone className="qa-icon blue-icon" />
                <div>
                  <h5>Fake Call</h5>
                  <p>Simulate a realistic incoming call to escape uncomfortable situations.</p>
                </div>
              </div>
              <button className="btn qa-btn qa-btn-blue" onClick={() => setShowFakeCallSetup(true)}>
                <FiPhone /> Setup Call
              </button>
            </div>

            {/* Broadcast SOS */}
            <button className="btn btn-danger sos-big" onClick={triggerSOS}>
              🚨 BROADCAST SOS TO ALL CIRCLES
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
