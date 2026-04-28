document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginBtn  = document.getElementById("login-btn");

    /* ── Loading state — works with Bootstrap button (no separate span IDs needed) */
    function setLoading(on) {
        if (!loginBtn) return;
        loginBtn.disabled   = on;
        loginBtn.innerHTML  = on
            ? 'Please wait... <i class="fas fa-spinner fa-spin float-end mt-1"></i>'
            : 'Login <i class="fas fa-sign-in-alt float-end mt-1"></i>';
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;

            setLoading(true);
            try {
                const response = await fetch("/api/login", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ username, password })
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
    }

    /* ── Close modal on backdrop click */
    const errorModal = document.getElementById("error-modal");
    if (errorModal) {
        errorModal.addEventListener("click", (e) => {
            if (e.target.id === "error-modal") {
                errorModal.style.display = "none";
            }
        });
    }
});

function showErrorModal() {
    const modal = document.getElementById("error-modal");
    if (modal) modal.style.display = "flex";
}
