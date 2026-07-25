  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginButton = document.querySelector(".login-button");
  const formMessage = document.getElementById("formMessage");
  const loginCard = document.querySelector(".login-card");

  function showError(input, message) {
    const group = input.closest(".input-group");

    group.classList.remove("valid");
    group.classList.add("invalid");
    group.querySelector(".error-message").textContent = message;
  }

  function showSuccess(input) {
    const group = input.closest(".input-group");

    group.classList.remove("invalid");
    group.classList.add("valid");
    group.querySelector(".error-message").textContent = "";
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showError(emailInput, "لطفاً ایمیل خود را وارد کنید.");
      return false;
    }

    if (!emailPattern.test(email)) {
      showError(emailInput, "فرمت ایمیل معتبر نیست.");
      return false;
    }

    showSuccess(emailInput);
    return true;
  }

  function validatePassword() {
    const password = passwordInput.value;

    if (!password) {
      showError(passwordInput, "لطفاً رمز عبور خود را وارد کنید.");
      return false;
    }

    if (password.length < 8) {
      showError(passwordInput, "رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return false;
    }

    showSuccess(passwordInput);
    return true;
  }

  function updatePasswordStrength() {
    const password = passwordInput.value;
    const strengthBar = document.querySelector(".password-strength span");

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = [
      { width: "0%", color: "#ff5c7a" },
      { width: "25%", color: "#ff5c7a" },
      { width: "50%", color: "#ffb84d" },
      { width: "75%", color: "#00d4ff" },
      { width: "100%", color: "#2ee6a6" }
    ];

    strengthBar.style.width = levels[score].width;
    strengthBar.style.background = levels[score].color;
  }

  emailInput.addEventListener("input", () => {
    if (emailInput.closest(".input-group").classList.contains("invalid")) {
      validateEmail();
    }
  });

  passwordInput.addEventListener("input", () => {
    updatePasswordStrength();

    if (passwordInput.closest(".input-group").classList.contains("invalid")) {
      validatePassword();
    }
  });

  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    const openEye = togglePassword.querySelector(".eye-open");
    const closedEye = togglePassword.querySelector(".eye-closed");

    passwordInput.type = isHidden ? "text" : "password";
    openEye.classList.toggle("hidden", isHidden);
    closedEye.classList.toggle("hidden", !isHidden);

    togglePassword.setAttribute(
      "aria-label",
      isHidden ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
    );
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "";

    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();

    if (!emailIsValid || !passwordIsValid) return;

    loginButton.classList.add("loading");

    // شبیه‌سازی ارسال اطلاعات به سرور
    setTimeout(() => {
      loginButton.classList.remove("loading");
      loginButton.classList.add("success");
      formMessage.textContent = "ورود با موفقیت انجام شد!";

      setTimeout(() => {
        loginButton.classList.remove("success");
      }, 2500);
    }, 1800);
  });

  // افکت موج کلیک دکمه
  loginButton.addEventListener("click", (event) => {
    const oldRipple = loginButton.querySelector(".ripple");
    if (oldRipple) oldRipple.remove();

    const ripple = document.createElement("span");
    const diameter = Math.max(loginButton.clientWidth, loginButton.clientHeight);
    const rect = loginButton.getBoundingClientRect();

    ripple.className = "ripple";
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;

    loginButton.appendChild(ripple);
  });

  // حرکت سه‌بعدی کارت
  document.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 768) return;

    const rotateY = (event.clientX / window.innerWidth - 0.5) * 5;
    const rotateX = (event.clientY / window.innerHeight - 0.5) * -5;

    loginCard.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener("mouseleave", () => {
    loginCard.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0)";
  });

  // ذرات متحرک پس‌زمینه
  const canvas = document.getElementById("particles");
  const context = canvas.getContext("2d");

  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const particleCount = Math.min(
      80,
      Math.floor((canvas.width * canvas.height) / 18000)
    );

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.5,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.6 + 0.2
    }));
  }

  function animateParticles() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }

      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle = `rgba(150, 130, 255, ${particle.opacity})`;
      context.fill();

      particles.slice(index + 1).forEach((secondParticle) => {
        const distanceX = particle.x - secondParticle.x;
        const distanceY = particle.y - secondParticle.y;
        const distance = Math.hypot(distanceX, distanceY);

        if (distance < 100) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(secondParticle.x, secondParticle.y);
          context.strokeStyle =
            `rgba(124, 92, 255, ${0.08 * (1 - distance / 100)})`;
          context.stroke();
        }
      });
    });

    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  createParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

