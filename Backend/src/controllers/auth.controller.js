import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity",
    html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
  <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

    <h2 style="color:#333;">Welcome to Perplexity, ${username} 👋</h2>

    <p style="color:#555; line-height:1.6;">
      Thank you for registering with <strong>Perplexity</strong>.  
      We're excited to have you on board.
    </p>

    <p style="color:#555; line-height:1.6;">
      Please verify your email address by clicking the button below.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a 
        href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}"
        style="
          background:#4f46e5;
          color:white;
          padding:12px 24px;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
          display:inline-block;
        ">
        Verify Email Address
      </a>
    </div>

    <p style="color:#777; font-size:14px;">
      If you did not create this account, you can safely ignore this email.
    </p>

    <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

    <p style="color:#999; font-size:13px;">
      Best regards,<br>
      <strong>Team Perplexity</strong>
    </p>

  </div>
</div>
`,
  });

  res.status(201).json({
    message: "User registered sucessfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found",
      });
    }

    user.verified = true;
    await user.save();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Email Verified</title>

<style>
body{
  margin:0;
  font-family:Arial, sans-serif;
  background:#f4f6f8;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}

.container{
  background:white;
  padding:40px;
  border-radius:10px;
  text-align:center;
  box-shadow:0 4px 20px rgba(0,0,0,0.08);
  max-width:420px;
}

h1{
  color:#22c55e;
}

p{
  color:#555;
  margin-top:10px;
  line-height:1.6;
}

button{
  margin-top:25px;
  padding:12px 22px;
  border:none;
  background:#4f46e5;
  color:white;
  font-size:15px;
  border-radius:6px;
  cursor:pointer;
}

button:hover{
  background:#4338ca;
}
</style>

</head>

<body>

<div class="container">

  <h1>✅ Email Verified</h1>

  <p>
    Your email has been successfully verified.
    You can now start using <strong>Perplexity</strong>.
  </p>

  <p>
    Thank you for joining us 🚀
  </p>

  <button onclick="window.location.href='http://localhost:3000/login'">
    Go to Login
  </button>

</div>

</body>
</html>
`;

    res.send(html);
  } catch (err) {
    res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password!",
      success: false,
      err: "User not found!",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password!",
      success: false,
      err: "Incorrect Password!",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in!",
      success: false,
      err: "Email not verified!",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful.",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req,res){
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message :"User not found",
            success : false,
            err : "User not found"
        })
        
    }

    res.status(200).json({
        message : "User details fetched successfully.",
        success : true,
        user
    })
}