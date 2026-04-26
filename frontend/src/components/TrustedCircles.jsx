import React from 'react';
import { FiPlus, FiUserPlus, FiMoreVertical } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './TrustedCircles.css';

const TrustLevelGroup = ({ title, description, contacts, color, onAdd, triggerSOSToContact, onDelete }) => (
  <div className="trust-group">
    <div className="group-header">
      <div className="group-title">
        <div className="status-indicator" style={{ backgroundColor: color }}></div>
        <h4>{title}</h4>
      </div>
      <p>{description}</p>
    </div>
    <div className="contacts-grid">
      {contacts.map((contact, idx) => (
        <div className="contact-card" key={contact._id || `mock-${idx}`}>
          <div className="contact-avatar">{(contact.name ? contact.name.substring(0, 2).toUpperCase() : 'U')}</div>
          <div className="contact-info">
            <h5>{contact.name}</h5>
            <p>{contact.phoneNumber || contact.relation || 'Guardian'}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
            <button className="btn btn-danger" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}} onClick={() => { if(window.confirm(`Send direct SOS to ${contact.name}?`)) triggerSOSToContact(contact); }}>
              SOS
            </button>
            {onDelete && (
              <button 
                className="btn outline" 
                style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ff4444', borderColor: '#ff4444'}} 
                onClick={() => contact._id ? onDelete(contact._id) : alert("Cannot remove system-protected contact.")}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
      <button className="add-contact-card" onClick={onAdd}>
        <FiUserPlus className="add-icon" />
        <span>Add Guardian</span>
      </button>
    </div>
  </div>
);

const TrustedCircles = () => {
  const { user, addContact, deleteContact, triggerSOS, triggerSOSToContact } = useAuth();
  
  const [primaryContacts, setPrimaryContacts] = React.useState(
    user?.emergencyContacts || []
  );

  React.useEffect(() => {
    if (user && user.emergencyContacts) {
      setPrimaryContacts(user.emergencyContacts);
    }
  }, [user]);

  const handleAddGuardian = async () => {
    const name = window.prompt("Enter Guardian's Name:");
    if (!name) return;
    
    let phoneInput = window.prompt("Enter 10-digit Indian Mobile Number:");
    if (!phoneInput) return;
    
    let cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '+91' + cleanPhone;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = '+' + cleanPhone;
    } else {
      alert("Please enter a valid 10-digit Indian phone number (e.g., 9876543210)");
      return;
    }
    
    // Call our context function which hits the backend
    await addContact(name, cleanPhone, 'guardian@example.com');
  };

  const friendContacts = [
    { _id: 'f1', name: 'Elena Gilbert', relation: 'Best Friend', initials: 'EG' }
  ];

  const workContacts = [
    { _id: 'w1', name: 'Michael Scott', relation: 'Manager', initials: 'MS' },
    { _id: 'w2', name: 'Pam Beesly', relation: 'Office Colleague', initials: 'PB' }
  ];

  return (
    <div className="circles-container">
      <div className="circles-header">
        <div className="circles-title">
          <h2>Trusted Circles</h2>
          <p>Organize your emergency contacts into prioritized tiers. Manage who gets alerts when your safety protocol is triggered.</p>
        </div>
        <button className="btn btn-danger" onClick={triggerSOS}>
          Broadcast SOS to All Circles
        </button>
      </div>

      <div className="groups-container">
        <TrustLevelGroup 
          title="Primary Guardians" 
          description="Immediate alerts on any SOS trigger. Live location shared."
          contacts={primaryContacts}
          color="#D32F2F"
          onAdd={handleAddGuardian}
          triggerSOSToContact={triggerSOSToContact}
          onDelete={deleteContact}
        />
        <TrustLevelGroup 
          title="Close Friends" 
          description="Alerted alongside primary guardians if no response within 2 mins."
          contacts={friendContacts}
          color="#576CBC"
          onAdd={handleAddGuardian}
          triggerSOSToContact={triggerSOSToContact}
        />
        <TrustLevelGroup 
          title="Office Colleagues" 
          description="Alerted only during specific office hours or commute."
          contacts={workContacts}
          color="#4CAF50"
          onAdd={handleAddGuardian}
          triggerSOSToContact={triggerSOSToContact}
        />
      </div>
    </div>
  );
};

export default TrustedCircles;
