// استخراج الإيميل من رابط الصفحة
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

document.getElementById('verifyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const otp = document.getElementById('otp').value;
  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  errorDiv.innerText = '';
  successDiv.innerText = '';

  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (response.ok) {
      successDiv.innerText = '✅ تم تأكيد الحساب بنجاح!';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      errorDiv.innerText = `❌ ${data.error || 'رمز غير صحيح'}`;
    }
  } catch (error) {
    errorDiv.innerText = '❌ متعذر الاتصال بالسيرفر';
  }
});