# Contact Form - Firebase Integration Guide

## ✅ What Was Implemented

The contact form now **saves all submissions to Firebase Firestore** in real-time!

### 📍 Where Do Emails Go?

When someone submits the contact form, the data is saved to:
- **Firestore Collection**: `contact_submissions`
- **Location**: Firebase Console → Firestore Database → contact_submissions

### 📊 Data Structure

Each submission contains:
```typescript
{
  name: string,           // User's full name
  email: string,          // User's email address
  subject: string,        // Selected subject (support, dating, immigration, etc.)
  message: string,        // The message content
  status: 'new',          // Status: 'new', 'read', or 'replied'
  createdAt: Timestamp,   // Server timestamp
  userAgent: string,      // Browser/device info
  language: string        // User's browser language
}
```

## 🔍 How to View Contact Form Submissions

### Option 1: Firebase Console (Easiest)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **BabHijra**
3. Click **Firestore Database** in the left menu
4. Look for the `contact_submissions` collection
5. Click on any document to view the submission details

### Option 2: Build an Admin Panel (Recommended for Production)
Create an admin page at `/admin/contacts` to view and manage submissions.

## 🎯 Next Steps (Optional Enhancements)

### 1. Email Notifications
Get notified when someone submits the form:

**Option A: Firebase Cloud Functions + SendGrid/Mailgun**
```javascript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendContactNotification = functions.firestore
  .document('contact_submissions/{submissionId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const msg = {
      to: 'info@babhijra.com',
      from: 'noreply@babhijra.com',
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `
    };
    
    await sgMail.send(msg);
  });
```

**Option B: Zapier Integration (No Code)**
1. Create a Zapier account
2. Connect Firebase Firestore as trigger
3. Connect Gmail/Email as action
4. Map the fields

### 2. Auto-Reply Email
Send an automatic confirmation email to the user:

```javascript
// In the same Cloud Function
const autoReply = {
  to: data.email,
  from: 'noreply@babhijra.com',
  subject: 'تم استلام رسالتك - باب الهجرة',
  html: `
    <div dir="rtl">
      <h2>شكراً لتواصلك معنا!</h2>
      <p>عزيزي/عزيزتي ${data.name},</p>
      <p>تم استلام رسالتك بنجاح. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
      <p>مع تحيات فريق باب الهجرة</p>
    </div>
  `
};
await sgMail.send(autoReply);
```

### 3. Admin Dashboard
Create a page to manage submissions:

**File**: `src/pages/admin/contacts.astro`
```astro
---
// Protected admin route
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
---

<main>
  <h1>Contact Form Submissions</h1>
  <div id="submissions"></div>
</main>

<script>
  import { db } from '../../lib/firebase/client';
  import { collection, query, orderBy, getDocs } from 'firebase/firestore';
  
  async function loadSubmissions() {
    const q = query(
      collection(db, 'contact_submissions'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const submissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Render submissions
    const container = document.getElementById('submissions');
    container.innerHTML = submissions.map(sub => `
      <div class="submission-card">
        <h3>${sub.name} - ${sub.email}</h3>
        <p><strong>Subject:</strong> ${sub.subject}</p>
        <p>${sub.message}</p>
        <span class="status ${sub.status}">${sub.status}</span>
      </div>
    `).join('');
  }
  
  loadSubmissions();
</script>
```

### 4. Firestore Security Rules
Update your Firestore rules to secure the contact submissions:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Contact submissions - anyone can create, only admins can read
    match /contact_submissions/{submissionId} {
      allow create: if request.auth != null || true; // Allow anonymous submissions
      allow read, update, delete: if request.auth != null && 
                                    get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Spam Protection
Add reCAPTCHA to prevent spam:

1. Get reCAPTCHA keys from Google
2. Add to your `.env`:
```
PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

3. Update the form:
```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
```

## 📋 Testing the Contact Form

1. **Test Submission**:
   - Go to http://localhost:4321/contact
   - Fill out the form
   - Click "إرسال الرسالة"
   - You should see a success message

2. **Verify in Firebase**:
   - Open Firebase Console
   - Go to Firestore Database
   - Look for `contact_submissions` collection
   - You should see your test submission

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Check for any errors
   - Successful submission should show no errors

## 🔒 Security Considerations

### Current Setup
- ✅ Form data is saved to Firestore
- ✅ Client-side validation
- ⚠️ No spam protection (add reCAPTCHA)
- ⚠️ No rate limiting (add Firebase Security Rules)

### Recommended Security Rules
```javascript
match /contact_submissions/{submissionId} {
  allow create: if request.resource.data.keys().hasAll(['name', 'email', 'subject', 'message'])
                && request.resource.data.name is string
                && request.resource.data.email.matches('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
                && request.resource.data.message.size() > 10
                && request.resource.data.message.size() < 5000;
}
```

## 📧 Email Service Providers (for notifications)

### Free Tier Options:
1. **SendGrid**: 100 emails/day free
2. **Mailgun**: 5,000 emails/month free (first 3 months)
3. **Amazon SES**: 62,000 emails/month free (if on AWS)
4. **Resend**: 3,000 emails/month free

### Setup Example (SendGrid):
```bash
npm install @sendgrid/mail
```

```javascript
// In Firebase Cloud Function
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'info@babhijra.com',
  from: 'noreply@babhijra.com',
  subject: 'New Contact Form',
  text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`
};

await sgMail.send(msg);
```

## 🎯 Summary

### ✅ What's Working Now:
- Contact form saves to Firestore
- Real-time data storage
- Success/error messages
- Form validation
- Browser info tracking

### 🔄 What You Can Add:
- Email notifications (Cloud Functions)
- Auto-reply emails
- Admin dashboard
- Spam protection (reCAPTCHA)
- Rate limiting
- Email service integration

### 📍 Where to Find Submissions:
**Firebase Console** → **Firestore Database** → **contact_submissions**

---

**Need help setting up email notifications?** Let me know and I can help you implement Firebase Cloud Functions with SendGrid or another email service!
