// كود الجافاسكربت في الفرونت إند إرسال البيانات
async function registerUser(name, email, password) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  if (response.ok) {
    alert("تم إنشاء الحساب بنجاح!");
  } else {
    alert(data.error);
  }
}