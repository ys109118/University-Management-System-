# 🔐 Password Reset System Guide

## Overview
The College Management System now has a secure password reset system with enhanced security features and better user experience.

## 🚀 How to Get Reset Password Links

### Method 1: Through the Application (Normal Flow)
1. Go to the login page
2. Click "Forgot Password?"
3. Select user type (Admin/Faculty/Student)
4. Enter email address
5. Check email for reset link

### Method 2: Generate Links Manually (For Testing)
```bash
cd backend
node get-reset-link.js <email> <userType>
```

**Examples:**
```bash
# For admin
node get-reset-link.js admin@gmail.com admin

# For faculty
node get-reset-link.js faculty@example.com faculty

# For student
node get-reset-link.js student@example.com student
```

## 🔒 Security Improvements Made

### 1. **Rate Limiting**
- Users can only request reset once every 5 minutes
- Prevents spam and brute force attempts

### 2. **Enhanced Token Security**
- Tokens now include timestamp and email
- Increased expiry time to 15 minutes
- Stronger salt rounds (12 instead of 10)

### 3. **Password Strength Validation**
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Real-time validation feedback in UI

### 4. **Email Enumeration Protection**
- Always returns success message regardless of email existence
- Prevents attackers from discovering valid emails

### 5. **Improved Error Handling**
- Better JWT token validation
- Automatic cleanup of expired tokens
- User-friendly error messages

## 📧 Email Configuration

Make sure your `.env` file has proper email settings:

```env
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_password
FRONTEND_API_LINK=http://localhost:3000
```

### Gmail Setup:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in `NODEMAILER_PASS`

## 🎨 Enhanced Email Template

The new email template includes:
- Professional design with College Management System branding
- Clear call-to-action button
- Security warnings about expiration
- Mobile-responsive layout

## 🔄 Reset Password Flow

```
1. User requests reset → Email sent (if exists)
2. User clicks email link → Validates token
3. User enters new password → Validates strength
4. Password updated → All reset tokens cleared
```

## 🧪 Testing the System

### Test Cases:
1. **Valid Email**: Should receive reset email
2. **Invalid Email**: Should show success (security)
3. **Expired Token**: Should show error
4. **Weak Password**: Should show validation error
5. **Rate Limiting**: Should prevent multiple requests

### Test Commands:
```bash
# Generate test reset link
node get-reset-link.js admin@gmail.com admin

# Test with different user types
node get-reset-link.js test@example.com faculty
node get-reset-link.js student@test.com student
```

## 🚨 Troubleshooting

### Common Issues:

1. **Email not sending**
   - Check NODEMAILER credentials
   - Verify Gmail app password
   - Check spam folder

2. **Reset link not working**
   - Verify FRONTEND_API_LINK in .env
   - Check if token expired (15 min limit)
   - Ensure MongoDB connection

3. **Password validation failing**
   - Must be 8+ characters
   - Need uppercase, lowercase, number
   - Check for special characters if needed

## 📱 Frontend Features

### Password Strength Indicator
- Real-time validation feedback
- Visual indicators for requirements
- User-friendly error messages

### Responsive Design
- Works on all devices
- Modern glassmorphism UI
- Smooth animations

## 🔧 API Endpoints

### Request Reset:
```
POST /{userType}/forget-password
Body: { "email": "user@example.com" }
```

### Update Password:
```
POST /{userType}/update-password/{resetId}
Body: { "password": "newPassword123" }
```

### Change Password (Logged In):
```
POST /{userType}/change-password
Headers: { "Authorization": "Bearer <token>" }
Body: { "currentPassword": "old", "newPassword": "new" }
```

## 🎯 Best Practices

1. **Always use HTTPS in production**
2. **Set strong JWT_SECRET**
3. **Monitor reset attempts**
4. **Regular security audits**
5. **Keep dependencies updated**

## 📊 Security Metrics

- **Token Expiry**: 15 minutes
- **Rate Limit**: 1 request per 5 minutes
- **Password Strength**: 8+ chars, mixed case, numbers
- **Salt Rounds**: 12 (high security)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the console logs
2. Verify environment variables
3. Test with the utility script
4. Contact: ys109118@gmail.com