document.addEventListener("DOMContentLoaded", () => {
  fetch('data/economy.json')
    .then(res => res.json())
    .then(data => {
      const econ = data.status;
      document.getElementById("econ-label").textContent = econ;

      const options = getOptionsForEconomy(econ);
      const list = document.getElementById("rebuild-options");

      options.forEach(opt => {
        const li = document.createElement("li");
        li.textContent = opt;
        list.appendChild(li);
      });
    });
});

function getOptionsForEconomy(status) {
  if (status === "Υψηλή Ανάπτυξη") {
    return ["Κατασκευή Πολυώροφης Κατοικίας", "Χώροι Πρασίνου", "Υπόγειο Πάρκινγκ"];
  } else if (status === "Στασιμότητα") {
    return ["Ανακαίνιση Υφιστάμενου", "Αναστολή νέων αδειών"];
  } else if (status === "Ύφεση") {
    return ["Καμία εργασία", "Προσπάθεια ενεργειακής αναβάθμισης"];
  } else {
    return ["Καμία πληροφορία διαθέσιμη"];
  }
}
