document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // منع إعادة تحميل الصفحة عند الضغط

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  errorDiv.innerText = '';
  successDiv.innerText = '';

  try {
    // إرسال البيانات للـ API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      successDiv.innerText = '✅ تم إنشاء الحساب بنجاح! يتم التوجيه...';
      setTimeout(() => {
       window.location.href = `verify.html?email=${encodeURIComponent(email)}`;
      }, 1500);
    } else {
      errorDiv.innerText = `❌ ${data.error || 'فشل إنشاء الحساب'}`;
    }
  } catch (error) {
    errorDiv.innerText = '❌ متعذر الاتصال بالسيرفر';
  }
});