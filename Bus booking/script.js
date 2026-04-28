// ================= DATA =================
const cities = [
  "Guwahati", "Nagaon", "Tezpur", "Sonitpur",
  "Bongaigaon", "Silchar", "Dibrugarh"
];

const buses = [
  {id:1, name:"Volvo AC", from:"Guwahati", to:"Tezpur", time:"08:00 - 12:00", price:500, seats:24},
  {id:2, name:"Sleeper Deluxe", from:"Guwahati", to:"Silchar", time:"20:00 - 06:00", price:900, seats:30},
  {id:3, name:"Express", from:"Nagaon", to:"Guwahati", time:"09:00 - 12:00", price:300, seats:20},
  {id:4, name:"Luxury AC", from:"Tezpur", to:"Bongaigaon", time:"07:00 - 13:00", price:600, seats:28},
  {id:5, name:"Night Rider", from:"Guwahati", to:"Dibrugarh", time:"21:00 - 07:00", price:1100, seats:30},
  {id:6, name:"Mini Express", from:"Sonitpur", to:"Guwahati", time:"06:00 - 10:00", price:350, seats:18},
  {id:7, name:"AC Seater", from:"Bongaigaon", to:"Guwahati", time:"10:00 - 14:00", price:400, seats:22},
  {id:8, name:"Super Deluxe", from:"Silchar", to:"Guwahati", time:"19:00 - 05:00", price:950, seats:30}
];

let selectedBus = null;
let selectedSeats = [];
let paymentMethod = "upi";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadBookings();
  setupSuggestions("from");
  setupSuggestions("to");
});

// ================= SEARCH =================
function searchBuses() {
  const from = document.getElementById("from").value.trim().toLowerCase();
  const to = document.getElementById("to").value.trim().toLowerCase();
  const list = document.getElementById("busList");

  list.innerHTML = "";

  const results = buses.filter(b =>
    b.from.toLowerCase().includes(from) &&
    b.to.toLowerCase().includes(to)
  );

  if (results.length === 0) {
    list.innerHTML = "<p>No buses found 🚫</p>";
    return;
  }

  results.forEach(b => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${b.name}</h3>
      <p><b>${b.from}</b> → <b>${b.to}</b></p>
      <p>Time: ${b.time}</p>
      <p><b>Fare: ₹${b.price}</b></p>
      <p>Available Seats: ${getAvailableSeats(b.id)}</p>
      <button class="select-btn">Select Seat</button>
    `;

    div.querySelector(".select-btn").onclick = () => selectBus(b.id);

    list.appendChild(div);
  });
}

// ================= SUGGESTIONS =================
function setupSuggestions(inputId) {
  const input = document.getElementById(inputId);

  const dropdown = document.createElement("div");
  dropdown.className = "suggestions";
  input.parentNode.appendChild(dropdown);

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    dropdown.innerHTML = "";

    if (!value) return;

    const matches = cities.filter(city =>
      city.toLowerCase().includes(value)
    );

    matches.forEach(city => {
      const item = document.createElement("div");
      item.innerText = city;

      item.onclick = () => {
        input.value = city;
        dropdown.innerHTML = "";
      };

      dropdown.appendChild(item);
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target !== input) dropdown.innerHTML = "";
  });
}

// ================= SEATS =================
function getAvailableSeats(busId) {
  const booked = JSON.parse(localStorage.getItem("bookedSeats_" + busId) || "[]");
  const bus = buses.find(b => b.id === busId);
  return bus.seats - booked.length;
}

function selectBus(id) {
  selectedBus = buses.find(b => b.id === id);
  selectedSeats = [];

  document.getElementById("seatSection").classList.remove("hidden");
  renderSeats();
  updateTotal();
}

function renderSeats() {
  const container = document.getElementById("seatContainer");
  container.innerHTML = "";

  const booked = JSON.parse(localStorage.getItem("bookedSeats_" + selectedBus.id) || "[]");

  for (let i = 1; i <= selectedBus.seats; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.innerText = i;

    if (booked.includes(i)) {
      seat.classList.add("booked");
    } else {
      seat.onclick = () => {
        seat.classList.toggle("selected");

        if (selectedSeats.includes(i)) {
          selectedSeats = selectedSeats.filter(s => s !== i);
        } else {
          selectedSeats.push(i);
        }

        updateTotal();
      };
    }

    container.appendChild(seat);
  }
}

// ================= PRICE =================
function updateTotal() {
  const total = selectedSeats.length * (selectedBus?.price || 0);

  document.getElementById("total").innerText = total;
  document.getElementById("selectedSeatsText").innerText =
    selectedSeats.length ? selectedSeats.join(", ") : "None";
}

// ================= PAYMENT =================
function confirmBooking() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const phone = document.getElementById("phone").value;

  if (!name || !age || !phone) {
    alert("Fill all fields ⚠️");
    return;
  }

  if (selectedSeats.length === 0) {
    alert("Select seats first");
    return;
  }

  const total = selectedSeats.length * selectedBus.price;

  document.getElementById("payAmount").innerText = total;
  document.getElementById("paymentModal").classList.remove("hidden");
}

function selectPayment(method) {
  paymentMethod = method;

  document.getElementById("upiSection").classList.toggle("hidden", method !== "upi");
  document.getElementById("cardSection").classList.toggle("hidden", method !== "card");
}

function closePayment() {
  document.getElementById("paymentModal").classList.add("hidden");
}

function processPayment() {
  if (paymentMethod === "upi") {
    const upi = document.getElementById("upiId").value;
    if (!upi.includes("@")) {
      alert("Enter valid UPI ID");
      return;
    }
  }

  document.querySelector(".modal-content").innerHTML = "<h3>Processing Payment...</h3>";

  setTimeout(() => {
    saveBooking();
    alert("Payment Successful ✅");
    location.reload();
  }, 1200);
}

// ================= BOOKINGS =================
function saveBooking() {
  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  bookings.push({
    name: document.getElementById("name").value,
    route: `${selectedBus.from} → ${selectedBus.to}`,
    seats: selectedSeats,
    total: selectedSeats.length * selectedBus.price
  });

  localStorage.setItem("bookings", JSON.stringify(bookings));

  let booked = JSON.parse(localStorage.getItem("bookedSeats_" + selectedBus.id) || "[]");
  booked = [...booked, ...selectedSeats];
  localStorage.setItem("bookedSeats_" + selectedBus.id, JSON.stringify(booked));
}

function loadBookings() {
  const list = document.getElementById("bookingList");
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  list.innerHTML = "";

  bookings.forEach((b, i) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p><b>${b.name}</b> | ${b.route}</p>
      <p>Seats: ${b.seats.join(", ")}</p>
      <p>Total: ₹${b.total}</p>
      <button onclick="cancelBooking(${i})">Cancel</button>
    `;

    list.appendChild(div);
  });
}

function cancelBooking(index) {
  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  loadBookings();
}

// ================= THEME =================
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};