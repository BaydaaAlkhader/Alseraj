const sendEmail = async ({ to, subject, text }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "تطبيق السراج",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject: subject,
        textContent: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Brevo API");
    }

    return data;
  } catch (error) {
    console.error("خطأ في إرسال البريد عبر Brevo API:", error);
    throw error;
  }
};

module.exports = { sendEmail };