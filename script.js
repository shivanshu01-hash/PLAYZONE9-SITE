document.addEventListener("DOMContentLoaded", () => {
    const loginForm  = document.getElementById("login-form");
    const loginBtn   = document.getElementById("login-btn");
    const btnText    = document.getElementById("btn-text");
    const btnIcon    = document.getElementById("btn-icon");
    const btnSpinner = document.getElementById("btn-spinner");

    function setLoading(on) {
        loginBtn.disabled        = on;
        btnText.textContent      = on ? "Please wait..." : "Login";
        btnIcon.style.display    = on ? "none"   : "inline";
        btnSpinner.style.display = on ? "inline" : "none";
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        setLoading(true);
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = "https://www.playzone9.com/";
            } else {
                showErrorModal();
            }
        } catch (err) {
            console.error("Login error:", err);
            showErrorModal();
        } finally {
            setLoading(false);
        }
    });

    document.getElementById("error-modal").addEventListener("click", (e) => {
        if (e.target.id === "error-modal") {
            document.getElementById("error-modal").style.display = "none";
        }
    });
});

function showErrorModal() {
    document.getElementById("error-modal").style.display = "flex";
}
