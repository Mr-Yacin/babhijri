import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export const ImageUploadService = {
    /**
     * Upload a profile photo to Firebase Storage
     * Returns the download URL
     */
    async uploadProfilePhoto(uid: string, file: File): Promise<string> {
        try {
            // Create a unique filename
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const filename = `profiles/${uid}/${timestamp}.${extension}`;

            const storageRef = ref(storage, filename);

            // Upload file
            const snapshot = await uploadBytes(storageRef, file);

            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('فشل رفع الصورة');
        }
    },

    /**
     * Delete a profile photo from Firebase Storage
     */
    async deleteProfilePhoto(photoUrl: string): Promise<void> {
        try {
            const storageRef = ref(storage, photoUrl);
            await deleteObject(storageRef);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('فشل حذف الصورة');
        }
    },

    /**
     * Validate image file
     */
    validateImage(file: File): string | null {
        // Check type
        if (!file.type.startsWith('image/')) {
            return 'يرجى اختيار ملف صورة صالح';
        }

        // Check size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت';
        }

        return null;
    }
};
