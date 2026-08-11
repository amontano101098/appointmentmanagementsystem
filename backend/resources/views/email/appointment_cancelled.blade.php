<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; }
  .header { background: #1e293b; padding: 24px; text-align: center; }
  .header h1 { color: #d4af37; margin: 0; font-size: 22px; }
  .body { padding: 32px; }
  .body p { color: #374151; line-height: 1.6; }
  .detail { background: #f8fafc; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0; }
  .detail p { margin: 6px 0; color: #374151; }
  .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>Appointment Cancelled</h1></div>
  <div class="body">
    <p>Dear <strong>{{ $appointment->name }}</strong>,</p>
    <p>We regret to inform you that your appointment has been <strong>cancelled</strong> by our team.</p>
    <div class="detail">
      <p><strong>Date:</strong> {{ $appointment->date }}</p>
      <p><strong>Time:</strong> {{ $appointment->time }}</p>
      <p><strong>Status:</strong> Cancelled</p>
    </div>
    <p>If you believe this is a mistake or would like to reschedule, please contact us.</p>
    <p>We apologize for any inconvenience caused.</p>
  </div>
  <div class="footer">This is an automated message. Please do not reply directly to this email.</div>
</div>
</body>
</html>
