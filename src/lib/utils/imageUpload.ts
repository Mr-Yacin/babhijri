import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export const ImageUploadService = {
    /**
     * Compress an image file before uploading
     * @param file - The image file to compress
     * @param maxWidth - Maximum width (default: 1200px)
     * @param maxHeight - Maximum height (default: 1200px)
     * @param quality - JPEG quality 0-1 (default: 0.8)
     */
    async compressImage(
        file: File,
        maxWidth: number = 1200,
        maxHeight: number = 1200,
        quality: number = 0.8
    ): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    // Calculate new dimensions while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = width * ratio;
                        height = height * ratio;
                    }

                    // Create canvas and draw resized image
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    },

    /**
     * Upload a profile photo to Firebase Storage
     * Returns the download URL
     */
    async uploadProfilePhoto(uid: string, file: File): Promise<string> {
        try {
            // Compress the image before uploading
            const compressedBlob = await this.compressImage(file);

            // Create a unique filename with .jpg extension (since we compress to JPEG)
            const timestamp = Date.now();
            const filename = `profiles/${uid}/${timestamp}.jpg`;

            const storageRef = ref(storage, filename);

            // Upload compressed file with metadata
            const metadata = {
                contentType: 'image/jpeg',
                customMetadata: {
                    originalName: file.name
                }
            };

            const snapshot = await uploadBytes(storageRef, compressedBlob, metadata);

            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            // Provide more detailed error message
            const errorMessage = error?.message || 'فشل رفع الصورة';
            throw new Error(errorMessage);
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
