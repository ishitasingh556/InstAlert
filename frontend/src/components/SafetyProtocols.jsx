import React, { useState } from 'react';
import { 
  FiShield, FiActivity, FiMapPin, FiRadio, 
  FiClock, FiPhoneCall, FiTrendingUp, FiVideo,
  FiPlus, FiZap, FiTarget, FiAlertCircle
} from 'react-icons/fi';
import './SafetyProtocols.css';

const SafetyProtocols = () => {
  const [protocols, setProtocols] = useState({
    noMovement: true,
    routeDeviation: false,
    unexpectedStop: true,
    nightActivation: true,
    autoSOSPower: true,
    shakeDetection: false,
    voiceCommand: true,
    autoCheckIn: false,
    fakeCall: true,
    dataRecording: true
  });

  const [sensitivity, setSensitivity] = useState(75);
  const [checkInInterval, setCheckInInterval] = useState(30);

  const toggleProtocol = (key) => {
    setProtocols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="safety-protocols-container">
      <div className="card-header" style={{marginBottom: '40px'}}>
        <div>
          <h1 style={{fontSize: '2rem', marginBottom: '8px'}}>Safety Intelligence</h1>
          <p style={{color: 'var(--text-secondary)'}}>Configure automated triggers and emergency response protocols.</p>
        </div>
        <div className="status-pill active">System Guard Active</div>
      </div>

      <div className="protocols-grid">
        {/* Trigger-Based Rules */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiActivity className="icon" /> Trigger-Based Rules</h3>
          </div>
          <div className="control-group">
            <div className="control-row">
              <div className="control-info">
                <h4>No Movement Detection</h4>
                <p>Alert if stationary for {protocols.noMovement ? '5' : '--'} mins</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={protocols.noMovement} onChange={() => toggleProtocol('noMovement')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="control-row">
              <div className="control-info">
                <h4>Route Deviation</h4>
                <p>Detect departure from frequent paths</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={protocols.routeDeviation} onChange={() => toggleProtocol('routeDeviation')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="control-row">
              <div className="control-info">
                <h4>Night-time Activation</h4>
                <p>Auto-enable high security after 10 PM</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={protocols.nightActivation} onChange={() => toggleProtocol('nightActivation')} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <span className="section-label">Sensitivity Threshold</span>
          <input 
            type="range" 
            className="range-slider" 
            min="1" max="100" 
            value={sensitivity} 
            onChange={(e) => setSensitivity(e.target.value)}
          />
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)'}}>
            <span>LOW</span>
            <span>{sensitivity}%</span>
            <span>ULTRA</span>
          </div>
        </div>

        {/* Geofencing */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiMapPin className="icon" /> Geofencing Zones</h3>
            <FiPlus className="icon" style={{cursor: 'pointer', fontSize: '1.2rem'}} />
          </div>
          <div className="zone-list">
            <div className="zone-item">
              <div className="zone-indicator safe"></div>
              <div className="control-info">
                <h4>Home (Safe Zone)</h4>
                <p>Notifications paused, tracking minimal</p>
              </div>
            </div>
            <div className="zone-item">
              <div className="zone-indicator danger"></div>
              <div className="control-info">
                <h4>Downtown Alley (Risky Zone)</h4>
                <p>Auto-enable recording + high frequency GPS</p>
              </div>
            </div>
          </div>
          <div style={{marginTop: '20px', height: '100px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Map Preview Rendering...</p>
          </div>
        </div>

        {/* Auto SOS Triggers */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiZap className="icon" /> Auto SOS Triggers</h3>
          </div>
          <div className="control-group">
            <div className="control-row">
              <div className="control-info">
                <h4>Power Button Press</h4>
                <p>Triple click to trigger SOS</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={protocols.autoSOSPower} onChange={() => toggleProtocol('autoSOSPower')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="control-row">
              <div className="control-info">
                <h4>Shake to Alert</h4>
                <p>Vigorously shake device for 3s</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={protocols.shakeDetection} onChange={() => toggleProtocol('shakeDetection')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="control-row">
              <div className="control-info">
                <h4>Voice Command</h4>
                <p>Trigger: "Help me InstAlert"</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={protocols.voiceCommand} onChange={() => toggleProtocol('voiceCommand')} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Timed Check-in */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiClock className="icon" /> Timed Check-in</h3>
          </div>
          <div className="control-row">
            <div className="control-info">
              <h4>Auto Check-in Protocol</h4>
              <p>Verify safety at fixed intervals</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={protocols.autoCheckIn} onChange={() => toggleProtocol('autoCheckIn')} />
              <span className="slider"></span>
            </label>
          </div>
          <span className="section-label">Interval (Minutes)</span>
          <select 
            style={{width: '100%', background: '#1a1a1f', color: 'white', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px'}}
            value={checkInInterval}
            onChange={(e) => setCheckInInterval(e.target.value)}
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
          </select>
        </div>

        {/* Fake Call Automation */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiPhoneCall className="icon" /> Fake Call Automation</h3>
          </div>
          <div className="control-row">
            <div className="control-info">
              <h4>Smart Trigger</h4>
              <p>Simulate incoming call when risky</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={protocols.fakeCall} onChange={() => toggleProtocol('fakeCall')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="control-group">
            <span className="section-label">Caller Name</span>
            <input 
              type="text" 
              placeholder="Dad / Boss / Police"
              style={{width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'white', marginBottom: '16px'}}
            />
            <span className="section-label">Trigger Delay (Seconds)</span>
            <input type="range" className="range-slider" min="5" max="60" />
          </div>
        </div>

        {/* Escalation System */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiTrendingUp className="icon" /> Escalation System</h3>
          </div>
          <div className="escalation-steps">
            <div className="step">
              <h4>Level 1: Circle Alert</h4>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Notify 5 closest trusted contacts immediately.</p>
            </div>
            <div className="step">
              <h4>Level 2: Community Shield</h4>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Alert nearby InstAlert users (500m radius).</p>
            </div>
            <div className="step" style={{borderLeftColor: 'var(--accent-pink)'}}>
              <h4>Level 3: Emergency Services</h4>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Direct line to local police dispatch.</p>
            </div>
          </div>
        </div>

        {/* Data Recording */}
        <div className="protocol-card">
          <div className="card-header">
            <h3><FiVideo className="icon" /> Data Evidence</h3>
          </div>
          <div className="control-row">
            <div className="control-info">
              <h4>Automated Recording</h4>
              <p>Start Audio/Video capture on SOS</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={protocols.dataRecording} onChange={() => toggleProtocol('dataRecording')} />
              <span className="slider"></span>
            </label>
          </div>
          <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
             <div style={{flex: 1, padding: '10px', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.2)', borderRadius: '8px', textAlign: 'center'}}>
                <FiRadio style={{color: 'var(--accent-cyan)'}} />
                <p style={{fontSize: '0.7rem', marginTop: '4px'}}>Audio Active</p>
             </div>
             <div style={{flex: 1, padding: '10px', background: 'rgba(222, 78, 134, 0.05)', border: '1px solid rgba(222, 78, 134, 0.2)', borderRadius: '8px', textAlign: 'center'}}>
                <FiVideo style={{color: 'var(--accent-pink)'}} />
                <p style={{fontSize: '0.7rem', marginTop: '4px'}}>Video Active</p>
             </div>
          </div>
        </div>

        {/* Custom Protocol Builder */}
        <div className="protocol-card" style={{gridColumn: 'span 1'}}>
          <div className="card-header">
            <h3><FiTarget className="icon" /> Protocol Builder</h3>
          </div>
          <div className="builder-rule">
            <span className="keyword">IF</span> (time &gt; 10 PM <span className="keyword">AND</span> motion == stationary) <br/>
            <span className="keyword">THEN</span> (<span className="action">send_alert</span> + <span className="action">start_streaming</span>)
          </div>
          <button style={{width: '100%', marginTop: '16px', background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
            <FiPlus /> Create New Logic
          </button>
        </div>
      </div>

      <button className="activate-all-btn">
        <FiShield /> DEPLOY SECURITY PROTOCOLS
      </button>

      <div style={{marginTop: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
        <FiAlertCircle /> <span>All data is encrypted end-to-end and stored on secure decentralized nodes.</span>
      </div>
    </div>
  );
};

export default SafetyProtocols;
