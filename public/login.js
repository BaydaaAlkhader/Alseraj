document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  errorDiv.innerText = '';
  successDiv.innerText = '';

  try {
    const response = await fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

if (response.ok) {
  // حفظ التوكن والاسم في المتصفح
  localStorage.setItem('userToken', data.token);
  if (data.name) {
    localStorage.setItem('userName', data.name);
  }

  // التوجيه للوحدة الرئيسية
  window.location.href = 'dashboard.html';
} else {
  // عرض رسالة الخطأ القادمة من السيرفر
  errorDiv.innerText = data.error || 'حدث خطأ أثناء تسجيل الدخول';
}
  } catch (error) {
    errorDiv.innerText = '❌ متعذر الاتصال بالسيرفر';
  }
});