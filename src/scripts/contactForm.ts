import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm') as HTMLFormElement | null;
    const formMessage = document.getElementById('formMessage') as HTMLDivElement | null;

    if (!form || !formMessage) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
            status: 'new',
            createdAt: serverTimestamp(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (!submitButton) return;

        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'جاري الإرسال...';

        try {
            // Save to Firebase Firestore
            // Email will be sent automatically by Firebase Cloud Function
            const contactRef = collection(db, 'contact_submissions');
            const docRef = await addDoc(contactRef, data);

            console.log('✅ Saved to Firestore with ID:', docRef.id);
            console.log('📧 Email will be sent automatically to info@babhijra.com');

            // Show success message
            formMessage.className = 'p-4 bg-green-50 border border-green-200 rounded-lg text-green-800';
            formMessage.textContent = 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';
            formMessage.classList.remove('hidden');

            // Reset form
            form.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);

        } catch (error) {
            console.error('❌ Error submitting contact form:', error);

            // Show error message
            formMessage.className = 'p-4 bg-red-50 border border-red-200 rounded-lg text-red-800';
            formMessage.textContent = 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.';
            formMessage.classList.remove('hidden');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});
