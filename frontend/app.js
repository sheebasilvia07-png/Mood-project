// 🌐 Backend API URL
const API = "https://mood-project-x67z.onrender.com";

// =======================
// 🔐 LOGIN FUNCTION
// =======================
window.login = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("Login response:", data);

    alert(data.message);

    // ✅ REDIRECT TO DASHBOARD
    if (data.message === "Login successful") {
      localStorage.setItem("user", username); // store user
      window.location.href = "dashboard.html";
    }

  } catch (err) {
    console.log(err);
    alert("Server not running!");
  }
};

// =======================
// 📝 REGISTER FUNCTION
// =======================
window.register = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("Register response:", data);
    alert(data.message);

    // ✅ REDIRECT AFTER REGISTER
    if (data.message === "Registered successfully") {
      localStorage.setItem("user", username);
      window.location.href = "dashboard.html";
    }

  } catch (err) {
    console.log(err);
    alert("Error connecting to server");
  }
};

// =======================
// 👤 DASHBOARD USER CHECK
// =======================
window.onload = function () {
  const user = localStorage.getItem("user");

  // If on dashboard and not logged in → redirect to login
  if (window.location.pathname.includes("dashboard.html")) {
    if (!user) {
      alert("Please login first!");
      window.location.href = "index.html";
    } else {
      // Show username on dashboard (optional)
      const userDisplay = document.getElementById("userDisplay");
      if (userDisplay) {
        userDisplay.innerText = "Welcome, " + user + " 👋";
      }
    }
  }
};

// =======================
// 🚪 LOGOUT FUNCTION
// =======================
window.logout = function () {
  localStorage.removeItem("user");
  window.location.href = "index.html";
};

async function getRecommendation() {
  try {
    const mood = document.getElementById("mood").value;

    const res = await  fetch(`${API}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mood })
    });

    const data = await res.json();
    console.log(data);

    document.getElementById("result").innerHTML =
      "<b>Songs:</b><br> " + data.songs.join("<br>") +
      "<br><br><b>Activities:</b><br>" + data.activities.join("<br>");

    changeBackground(mood);

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("result").innerHTML = "<b>Error connecting to server.</b>";
  }
}

// ✅ background change using CSS classes
function changeBackground(mood) {
  document.body.className = mood;
}

function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return; // ✅ prevents crash

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDuration = (5 + Math.random() * 5) + "s";
    container.appendChild(particle);
  }
}