document.addEventListener("DOMContentLoaded", () => {
    // Gestion des onglets
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // CHARGER LE DERNIER EMAIL UTILISÉ
    const savedEmail = localStorage.getItem("lastUsedEmail");
    if (savedEmail) {
        document.getElementById('login-email').value = savedEmail;
    }

    // Regex pour la validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Connexion réussie !');
            localStorage.setItem("lastUsedEmail", email);
            window.location.href = '../index.html';
        } else {
            alert('Email ou mot de passe incorrect');
        }
    });

    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (!emailRegex.test(email)) {
            alert("Veuillez entrer un email valide !");
            return;
        }

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial !");
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.email === email)) {
            alert('Cet email est déjà utilisé');
            return;
        }

        const newUser = {
            username,
            email,
            password
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem("lastUsedEmail", email);

        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');

        // Basculer vers l'onglet de connexion
        document.querySelector('[data-tab="login"]').click();
        registerForm.reset();
    });
});
