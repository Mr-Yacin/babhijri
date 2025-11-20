# Firebase Cloud Functions - Automatic Email Notifications

## ✅ What Changed

The contact form now:
- ✅ Saves to Firestore
- ✅ Shows success message
- ❌ **NO MORE** mailto popup!

Emails will be sent **automatically** using Firebase Cloud Functions.

---

## 🚀 Quick Setup (Firebase Cloud Functions)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Functions

```bash
cd c:\Users\yacin\Documents\babhijri
firebase init functions
```

**Select:**
- Use existing project → Select your BabHijra project
- Language → TypeScript
- ESLint → Yes
- Install dependencies → Yes

### Step 4: Install Nodemailer

```bash
cd functions
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 5: Create the Email Function

Edit `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Configure your email service
// Option 1: Gmail (easiest for testing)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-gmail@gmail.com',  // Your Gmail
    pass: 'your-app-password'       // Gmail App Password (not regular password!)
  }
});

// Option 2: Zoho Mail
/*
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@babhijra.com',
    pass: 'your-zoho-password'
  }
});
*/

// Cloud Function: Send email when new contact submission is created
export const sendContactEmail = functions.firestore
  .document('contact_submissions/{submissionId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const mailOptions = {
      from: 'noreply@babhijra.com',
      to: 'info@babhijra.com',
      subject: `رسالة جديدة من نموذج الاتصال - ${data.subject}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0d9488;">📧 رسالة جديدة من نموذج الاتصال</h2>
          
          <div style="background-color: #f0fdfa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>الاسم:</strong> ${data.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
            <p><strong>الموضوع:</strong> ${data.subject}</p>
            <p><strong>التاريخ:</strong> ${new Date(data.createdAt.toDate()).toLocaleString('ar-EG')}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-right: 4px solid #0d9488;">
            <h3>الرسالة:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <hr style="margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            تم إرسال هذه الرسالة تلقائياً من نموذج الاتصال في موقع باب الهجرة<br>
            للرد، استخدم البريد الإلكتروني: ${data.email}<br>
            ID: ${context.params.submissionId}
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to info@babhijra.com');
      return null;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return null;
    }
  });
```

### Step 6: Deploy the Function

```bash
firebase deploy --only functions
```

---

## 📧 Email Service Options

### Option 1: Gmail (Easiest for Testing)

1. **Use your Gmail account**
2. **Enable 2-Step Verification**: https://myaccount.google.com/security
3. **Create App Password**: 
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Copy the 16-character password
4. **Use in code**:
   ```typescript
   user: 'your-gmail@gmail.com',
   pass: 'xxxx xxxx xxxx xxxx'  // App password
   ```

### Option 2: Zoho Mail (For Production)

1. **Use your Zoho email**: info@babhijra.com
2. **Get password** from your Zoho account
3. **Configure**:
   ```typescript
   host: 'smtp.zoho.com',
   port: 465,
   secure: true,
   auth: {
     user: 'info@babhijra.com',
     pass: 'your-zoho-password'
   }
   ```

### Option 3: SendGrid (Recommended for Production)

1. **Sign up**: https://sendgrid.com/ (Free: 100 emails/day)
2. **Get API Key**
3. **Install**: `npm install @sendgrid/mail`
4. **Use**:
   ```typescript
   import * as sgMail from '@sendgrid/mail';
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   await sgMail.send({
     to: 'info@babhijra.com',
     from: 'noreply@babhijra.com',
     subject: 'New Contact Form',
     html: '...'
   });
   ```

---

## 🎯 How It Works

```
User submits form
      ↓
Saved to Firestore
      ↓
Firebase Cloud Function triggered automatically
      ↓
Email sent to info@babhijra.com
      ↓
You receive the email!
```

**No popup, no user action needed!** ✨

---

## 💰 Cost

**Firebase Cloud Functions Free Tier:**
- 2 million invocations/month - FREE
- 400,000 GB-seconds - FREE
- 200,000 CPU-seconds - FREE

For a contact form, this is **more than enough!**

---

## 🧪 Testing

1. **Deploy the function**
2. **Submit a test form**
3. **Check Firebase Console** → Functions → Logs
4. **Check your email** at info@babhijra.com

---

## 📝 Alternative: Simple Solution (No Cloud Functions)

If you don't want to set up Cloud Functions, you can use **Zapier** (no code):

1. **Sign up** at https://zapier.com/
2. **Create Zap**: Firebase Firestore → Gmail/Email
3. **Trigger**: New document in `contact_submissions`
4. **Action**: Send email to info@babhijra.com
5. **Done!**

Free tier: 100 tasks/month

---

## ✅ Current Status

- ✅ Form saves to Firestore
- ✅ No mailto popup
- ⏳ **Next**: Set up Cloud Function or Zapier for automatic emails

---

**Choose your method and let me know if you need help setting it up!** 🚀
