const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

const apiInstance = new TransactionalEmailsApi();

// ضبط المفتاح بواسطة الخاصية المباشرة في الكلاس
apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const sendSmtpEmail = new SendSmtpEmail();
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