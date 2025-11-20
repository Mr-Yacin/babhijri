# EmailJS Setup Guide - Get Email Notifications to Your Zoho Email

## 📧 Simple Email Notifications Setup

Follow these steps to receive email notifications at **info@babhijra.com** when someone submits the contact form.

---

## 🚀 Step-by-Step Setup (5 minutes)

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up"** (top right)
3. Create a free account (100 emails/month free)
4. Verify your email address

---

### Step 2: Add Email Service (Zoho)

1. After logging in, click **"Email Services"** in the left menu
2. Click **"Add New Service"**
3. Select **"Gmail"** or **"Other"** (we'll use SMTP for Zoho)
4. For Zoho, select **"Other (SMTP)"**
5. Fill in the details:
   - **Service Name**: `Zoho Mail`
   - **Service ID**: (auto-generated, copy this!)
   - **SMTP Server**: `smtp.zoho.com`
   - **Port**: `465`
   - **Username**: `info@babhijra.com`
   - **Password**: Your Zoho email password
   - **Secure**: ✅ Yes (SSL/TLS)
6. Click **"Create Service"**
7. **Copy the Service ID** - you'll need this!

**Alternative (Easier):** Use Gmail instead:
- Select "Gmail" 
- Connect your Gmail account
- Much simpler setup!

---

### Step 3: Create Email Template

1. Click **"Email Templates"** in the left menu
2. Click **"Create New Template"**
3. Fill in the template:

**Template Name**: `Contact Form Notification`

**Subject**: 
```
رسالة جديدة من نموذج الاتصال - {{subject}}
```

**Content** (HTML):
```html
<div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
      📧 رسالة جديدة من نموذج الاتصال
    </h2>
    
    <div style="margin: 20px 0;">
      <p><strong>الاسم:</strong> {{from_name}}</p>
      <p><strong>البريد الإلكتروني:</strong> {{from_email}}</p>
      <p><strong>الموضوع:</strong> {{subject}}</p>
      <p><strong>التاريخ:</strong> {{timestamp}}</p>
    </div>
    
    <div style="background-color: #f0fdfa; padding: 20px; border-right: 4px solid #0d9488; margin: 20px 0;">
      <h3 style="color: #0d9488; margin-top: 0;">الرسالة:</h3>
      <p style="white-space: pre-wrap;">{{message}}</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      <p>تم إرسال هذه الرسالة من نموذج الاتصال في موقع باب الهجرة</p>
      <p>للرد، استخدم البريد الإلكتروني: {{from_email}}</p>
    </div>
  </div>
</div>
```

4. Click **"Save"**
5. **Copy the Template ID** - you'll need this!

---

### Step 4: Get Your Public Key

1. Click **"Account"** in the left menu
2. Find **"API Keys"** section
3. Copy your **Public Key** (starts with something like `user_...`)

---

### Step 5: Update Your Code

Open `src/pages/contact.astro` and replace the placeholders:

**Line 245** - Replace `YOUR_PUBLIC_KEY`:
```typescript
emailjs.init('YOUR_ACTUAL_PUBLIC_KEY_HERE');
```

**Lines 273-274** - Replace Service ID and Template ID:
```typescript
await emailjs.send(
  'YOUR_SERVICE_ID_HERE',    // From Step 2
  'YOUR_TEMPLATE_ID_HERE',   // From Step 3
  {
    to_email: 'info@babhijra.com',
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message,
    timestamp: new Date().toLocaleString('ar-EG')
  }
);
```

**Example with real values:**
```typescript
emailjs.init('user_abc123XYZ');

await emailjs.send(
  'service_zoho_mail',
  'template_contact_form',
  {
    to_email: 'info@babhijra.com',
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message,
    timestamp: new Date().toLocaleString('ar-EG')
  }
);
```

---

### Step 6: Test It!

1. Save the file
2. Go to http://localhost:4321/contact
3. Fill out the form with test data
4. Click submit
5. Check your **info@babhijra.com** inbox!

---

## 🎯 What Happens Now?

When someone submits the contact form:
1. ✅ Data is saved to Firebase Firestore
2. ✅ Email notification is sent to **info@babhijra.com**
3. ✅ User sees success message

---

## 📊 EmailJS Free Tier Limits

- **100 emails/month** - Free
- **1,000 emails/month** - $15/month
- **10,000 emails/month** - $70/month

For most small sites, 100/month is enough!

---

## 🔒 Security Notes

### Protecting Your API Keys

The EmailJS public key is safe to expose in client-side code. However, for better security:

1. **Add to .env file** (optional):
```env
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
```

2. **Use in code**:
```typescript
emailjs.init(import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY);

await emailjs.send(
  import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
  import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
  { ... }
);
```

---

## 🆘 Troubleshooting

### Email not received?

1. **Check spam folder** in your Zoho email
2. **Verify EmailJS dashboard** - check "Email Logs" section
3. **Check browser console** for errors (F12)
4. **Verify credentials** - Service ID, Template ID, Public Key

### "Failed to send" error?

1. Check your EmailJS account is verified
2. Verify SMTP settings for Zoho
3. Check you haven't exceeded free tier limit (100/month)
4. Try using Gmail instead of Zoho (easier setup)

### Using Gmail Instead (Recommended for Testing)

1. In EmailJS, add Gmail service
2. Click "Connect Account" and authorize with Google
3. Much simpler - no SMTP configuration needed!
4. Use your Gmail to receive notifications
5. Later, you can forward to your Zoho email

---

## 📝 Quick Reference

**Your EmailJS Dashboard**: https://dashboard.emailjs.com/

**What you need:**
- ✅ Public Key (from Account → API Keys)
- ✅ Service ID (from Email Services)
- ✅ Template ID (from Email Templates)

**Where to update:**
- File: `src/pages/contact.astro`
- Lines: 245, 273-274

---

## ✅ Checklist

- [ ] Created EmailJS account
- [ ] Added email service (Zoho or Gmail)
- [ ] Created email template
- [ ] Copied Public Key
- [ ] Copied Service ID
- [ ] Copied Template ID
- [ ] Updated contact.astro with real values
- [ ] Tested the form
- [ ] Received test email

---

**Need help?** The EmailJS documentation is excellent: https://www.emailjs.com/docs/

**Stuck?** Let me know which step you're on and I'll help!
