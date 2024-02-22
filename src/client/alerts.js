const addAlert = (type, content) => {
  const masthead = document.querySelector(".masthead");
  const alertContainer = document.createElement("div");
  const alert = document.createElement("div");

  alert.appendChild(document.createTextNode(content));
  alert.classList.add("alert-content");

  alertContainer.classList.add("alert-container");
  alertContainer.classList.add(`alert-${type}`);
  alertContainer.appendChild(alert);

  masthead.appendChild(alertContainer);
};

const removeAllAlerts = () => {
  const alerts = document.querySelectorAll("alert-container");

  Array.from(alerts.forEach((alert) => {
    alert.remove();
  }));
};

export {
  addAlert,
  removeAllAlerts
};
