const Alert = require('../models/Alert');
const User = require('../models/User');
const { sendSMSAlert } = require('../utils/smsService');

const triggerAlert = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const user = await User.findById(req.user._id);

    // Create a new alert
    const alert = await Alert.create({
      user: req.user._id,
      initialLocation: { latitude, longitude },
      locationHistory: [{ latitude, longitude }]
    });

    // Prepare message
    const message = `EMERGENCY ALERT: ${user.name} has triggered an SOS! Latest Location: https://maps.google.com/?q=${latitude},${longitude}`;

    // Send SMS to contacts
    let smsInfo = "No contacts to send SMS to.";
    if (user.emergencyContacts.length > 0) {
      const result = await sendSMSAlert(user.emergencyContacts, message);
      if (result && !result.success) {
        smsInfo = `Note: SMS could not be sent to some/all contacts (${result.message})`;
      } else {
        smsInfo = "SMS sent successfully.";
      }
    }

    res.status(201).json({
      message: `Alert triggered! ${smsInfo}`,
      alertId: alert._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = Date.now();
      await alert.save();
      
      const user = await User.findById(req.user._id);
      const message = `SAFE ALERT: ${user.name} is now safe and the emergency has been resolved.`;
      
      if (user.emergencyContacts.length > 0) {
        await sendSMSAlert(user.emergencyContacts, message);
      }

      res.json({ message: 'Alert resolved' });
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOne({ user: req.user._id, status: 'active' });
    if (alert) {
      res.json(alert);
    } else {
      res.status(404).json({ message: 'No active alerts found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const triggerAlertToContact = async (req, res) => {
  const { latitude, longitude, contactPhone, contactName } = req.body;

  try {
    const user = await User.findById(req.user._id);

    // Create an alert record
    const alert = await Alert.create({
      user: req.user._id,
      initialLocation: { latitude, longitude },
      locationHistory: [{ latitude, longitude }]
    });

    const message = `EMERGENCY ALERT: ${user.name} has sent you a direct SOS! Location: https://maps.google.com/?q=${latitude},${longitude}`;

    const result = await sendSMSAlert([{ name: contactName, phoneNumber: contactPhone }], message);

    let smsInfo;
    if (result && !result.success) {
      smsInfo = `Note: SMS could not be sent (${result.message})`;
    } else {
      smsInfo = `SOS sent to ${contactName}.`;
    }

    res.status(201).json({
      message: `Alert triggered! ${smsInfo}`,
      alertId: alert._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { triggerAlert, triggerAlertToContact, resolveAlert, getActiveAlert };
