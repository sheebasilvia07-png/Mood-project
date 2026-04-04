// 🌐 Backend API URL
const API = "https://mood-project-x67z.onrender.com";

// =======================
// 🛠 UI HELPERS & VALIDATION
// =======================
function showError(msg) {
  const errDiv = document.getElementById("auth-error");
  if (errDiv) {
    errDiv.innerText = msg;
    errDiv.style.display = "block";
  } else {
    alert(msg);
  }
}

function hideError() {
  const errDiv = document.getElementById("auth-error");
  if (errDiv) errDiv.style.display = "none";
}

function validatePassword(pwd) {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pwd);
}

// =======================
// 🔐 LOGIN FUNCTION
// =======================
window.login = async function (event) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  // Find button and update text
  let btn = null;
  if (event && event.target) {
      btn = event.target;
  } else {
      btn = document.querySelector("button[onclick='login()']") || document.querySelector("button[onclick='login(event)']");
  }

  hideError();

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  if (btn) btn.innerText = "Loading...";

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (btn) btn.innerText = "Login";

    const data = await res.json();
    console.log("Login response:", data);

    if (data.message === "Login successful") {
      localStorage.setItem("user", username);
      window.location.href = "dashboard.html";
    } else if (data.message === "Invalid credentials") {
      showError("Incorrect password or username. Please try again.");
    } else {
      showError(data.message);
    }
  } catch (err) {
    if (btn) btn.innerText = "Login";
    console.log(err);
    showError("Server not running or connection took too long!");
  }
};

// =======================
// 📝 REGISTER FUNCTION
// =======================
window.register = async function (event) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  // Find button and update text
  let btn = null;
  if (event && event.target) {
      btn = event.target;
  } else {
      btn = document.querySelector("button[onclick='register()']") || document.querySelector("button[onclick='register(event)']");
  }

  hideError();

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  if (!validatePassword(password)) {
    showError("Password must be at least 8 chars long with 1 uppercase, 1 lowercase & 1 number.");
    return;
  }

  if (btn) btn.innerText = "Loading...";

  try {
   const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (btn) btn.innerText = "Register";

    const data = await res.json();
    console.log("Register response:", data);

    if (data.message === "Registered successfully") {
      alert("Registered successfully!");
      localStorage.setItem("user", username);
      window.location.href = "dashboard.html";
    } else {
      showError(data.message);
    }
  } catch (err) {
    if (btn) btn.innerText = "Register";
    console.log(err);
    showError("Error connecting to server or connection took too long!");
  }
};

// =======================
// 🔑 RESET PASSWORD FORMS
// =======================
window.toggleResetForm = function(show) {
  hideError();
  if (show) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("reset-section").style.display = "block";
    document.getElementById("form-title").innerText = "Reset Password";
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("reset-section").style.display = "none";
    document.getElementById("form-title").innerText = "Login / Register";
  }
};

window.resetPassword = async function() {
  const username = document.getElementById("reset-username").value;
  const newPassword = document.getElementById("reset-password").value;
  hideError();

  if (!username || !newPassword) {
    showError("Please enter both username and new password.");
    return;
  }

  if (!validatePassword(newPassword)) {
    showError("New password must be at least 8 chars long with 1 uppercase, 1 lowercase & 1 number.");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newPassword })
    });

    const data = await res.json();
    
    if (data.message === "Password updated successfully") {
      alert("Password reset successfully! Please log in.");
      document.getElementById("reset-username").value = "";
      document.getElementById("reset-password").value = "";
      toggleResetForm(false);
    } else {
      showError(data.message);
    }
  } catch (err) {
    console.log(err);
    showError("Error connecting to server");
  }
};

// =======================
// 👤 DASHBOARD USER CHECK
// =======================
window.onload = function () {
  // ✅ Create floating particles
  createParticles();

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