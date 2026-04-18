let medicines = JSON.parse(localStorage.getItem("meds")) || [];
 
function saveData() {
  localStorage.setItem("meds", JSON.stringify(medicines));
}
 
// 🔊 Voice Function
function speak(text) {
  let speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}
 
function addMedicine() {
  let name = document.getElementById("name").value;
  let time = document.getElementById("time").value;
  let dose = document.getElementById("dose").value;
 
  if (!name || !time || !dose) {
    alert("Please fill all fields!");
    speak("Please fill all fields");
    return;
  }
 
  medicines.push({
    name,
    time,
    dose,
    status: "pending"
  });
 
  saveData();
  display();
 
  document.getElementById("name").value = "";
  document.getElementById("time").value = "";
  document.getElementById("dose").value = "";
}
 
function display() {
  let list = document.getElementById("list");
  list.innerHTML = "";
 
  let taken = 0, missed = 0;
 
  medicines.forEach((med, index) => {
 
    if (med.status === "taken") taken++;
    if (med.status === "missed") missed++;
 
    let color =
      med.status === "taken" ? "green" :
      med.status === "missed" ? "red" : "orange";
 
    let disable = med.status !== "pending" ? "disabled" : "";
 
    list.innerHTML += `
      <li>
        <b>${med.name}</b> (${med.dose}) - ${med.time}<br>
        Status: <span style="color:${color}">${med.status}</span><br><br>
 
        <button ${disable} onclick="markTaken(${index})">✅ Take</button>
        <button ${disable} onclick="markMissed(${index})">❌ Miss</button>
      </li>
      <hr>
    `;
  });
 
  document.getElementById("total").innerText = medicines.length;
  document.getElementById("taken").innerText = taken;
  document.getElementById("missed").innerText = missed;
}
 
function markTaken(i) {
  medicines[i].status = "taken";
  saveData();
  display();
  speak("Medicine taken");
}
 
function markMissed(i) {
  medicines[i].status = "missed";
  saveData();
  display();
  speak("Medicine missed");
}
 
// 🔔 Reminder + Voice
setInterval(() => {
  let now = new Date();
  let current = now.toTimeString().slice(0,5);
 
  medicines.forEach((med, index) => {
    if (med.time === current && med.status === "pending") {
 
      let message = `Time to take ${med.name}, dose ${med.dose}`;
      alert(message);
      speak(message); // 🔊 Voice reminder
 
      // Auto mark missed after 1 min
      setTimeout(() => {
        if (medicines[index].status === "pending") {
          medicines[index].status = "missed";
          saveData();
          display();
          speak(`${med.name} missed`);
        }
      }, 60000);
    }
  });
}, 60000);
 
display();