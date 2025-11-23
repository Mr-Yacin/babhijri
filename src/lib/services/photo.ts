import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseStorage } from '../firebase';

/**
 * Service for managing profile photos in Firebase Storage
 */
export class PhotoService {
    /**
     * Upload a photo to Firebase Storage
     * @param file - The file to upload
     * @param uid - User ID
     * @param photoIndex - Index of the photo (0-based)
     * @returns Download URL of the uploaded photo
     */
    static async uploadPhoto(file: File, uid: string, photoIndex: number): Promise<string> {
        try {
            const storage = getFirebaseStorage();
            if (!storage) {
                throw new Error('Storage not initialized');
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('الملف ليس صورة صالحة');
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            }

            // Create unique filename
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const filename = `${uid}_${photoIndex}_${timestamp}.${extension}`;
            const storageRef = ref(storage, `profile-photos/${uid}/${filename}`);

            // Upload file
            const snapshot = await uploadBytes(storageRef, file);

            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw error;
        }
    }

    /**
     * Delete a photo from Firebase Storage
     * @param photoURL - The URL of the photo to delete
     */
    static async deletePhoto(photoURL: string): Promise<void> {
        try {
            const storage = getFirebaseStorage();
            if (!storage) {
                throw new Error('Storage not initialized');
            }

            // Extract the storage path from the URL
            // URL format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media&token=[token]
            const path = this.extractStoragePathFromURL(photoURL);
            if (!path) {
                throw new Error('Invalid photo URL');
            }

            const photoRef = ref(storage, path);
            await deleteObject(photoRef);
        } catch (error) {
            console.error('Error deleting photo:', error);
            throw error;
        }
    }

    /**
     * Extract storage path from a Firebase Storage URL
     */
    private static extractStoragePathFromURL(url: string): string | null {
        try {
            // Check if it's a Firebase Storage URL
            if (!url.includes('firebasestorage.googleapis.com')) {
                return null;
            }

            // Extract the path between '/o/' and '?'
            const matches = url.match(/\/o\/(.+?)\?/);
            if (matches && matches[1]) {
                // Decode the URI component
                return decodeURIComponent(matches[1]);
            }

            return null;
        } catch (error) {
            console.error('Error extracting storage path:', error);
            return null;
        }
    }

    /**
     * Validate image dimensions
     */
    static validateImageDimensions(file: File): Promise<{ width: number; height: number; valid: boolean }> {
        return new Promise((resolve) => {
            const img = new Image();
            const objectURL = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(objectURL);
                const width = img.width;
                const height = img.height;

                // Minimum dimensions: 400x400
                const valid = width >= 400 && height >= 400;

                resolve({ width, height, valid });
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectURL);
                resolve({ width: 0, height: 0, valid: false });
            };

            img.src = objectURL;
        });
    }
}
