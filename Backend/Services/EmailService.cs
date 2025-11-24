using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            var smtpSettings = _config.GetSection("Smtp");

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Course Finder", smtpSettings["FromEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart("html")
            {
                Text = htmlContent   // <---- Your HTML email body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                smtpSettings["Host"],
                int.Parse(smtpSettings["Port"] ?? "587"),
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                smtpSettings["Username"],
                smtpSettings["Password"]   // Gmail App Password
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
