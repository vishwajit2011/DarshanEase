const nodemailer = require("nodemailer");


// ==========================================
// CREATE EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// ==========================================
// SEND PASSWORD RESET EMAIL
// ==========================================

const sendPasswordResetEmail = async (
  email,
  resetUrl
) => {
  const mailOptions = {
    from: `"DarshanEase" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "DarshanEase - Reset Your Password",

    html: `
      <div
        style="
          margin:0;
          padding:40px 20px;
          background:#f5f3ff;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <div
          style="
            max-width:600px;
            margin:auto;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          "
        >

          <div
            style="
              padding:30px;
              text-align:center;
              background:linear-gradient(
                135deg,
                #7c3aed,
                #5b21b6
              );
              color:white;
            "
          >

            <div
              style="
                font-size:42px;
                margin-bottom:10px;
              "
            >
              🛕
            </div>

            <h1
              style="
                margin:0;
                font-size:28px;
              "
            >
              DarshanEase
            </h1>

            <p
              style="
                margin:8px 0 0;
                opacity:0.9;
              "
            >
              Your Spiritual Journey Made Simple
            </p>

          </div>


          <div
            style="
              padding:35px;
              color:#333333;
            "
          >

            <h2
              style="
                margin-top:0;
                color:#222222;
              "
            >
              Reset Your Password
            </h2>

            <p
              style="
                line-height:1.7;
                color:#555555;
              "
            >
              We received a request to reset the
              password associated with your
              DarshanEase account.
            </p>

            <p
              style="
                line-height:1.7;
                color:#555555;
              "
            >
              Click the button below to create
              a new password.
            </p>


            <div
              style="
                text-align:center;
                margin:30px 0;
              "
            >

              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:14px 28px;
                  background:#7c3aed;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>

            </div>


            <p
              style="
                line-height:1.6;
                color:#777777;
                font-size:14px;
              "
            >
              This password reset link will expire
              in 15 minutes.
            </p>

            <p
              style="
                line-height:1.6;
                color:#777777;
                font-size:14px;
              "
            >
              If you did not request a password
              reset, you can safely ignore this email.
            </p>

          </div>


          <div
            style="
              padding:20px;
              text-align:center;
              background:#f8f7ff;
              color:#888888;
              font-size:12px;
            "
          >
            © ${new Date().getFullYear()} DarshanEase
          </div>

        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = sendPasswordResetEmail;