const Brevo = require("@getbrevo/brevo");

// إنشاء كائن الحساب والربط بـ API Key
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "تطبيق السراج",
      email: process.env.EMAIL_USER,
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;

    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("خطأ في إرسال البريد عبر Brevo:", error);
    throw error;
  }
};

module.exports = { sendEmail };