import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from 'browser-image-compression';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const readURL = (file: File): Promise<string | undefined> => {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target?.result?.toString());
        reader.onerror = e => rej(e);
        reader.readAsDataURL(file);
    });
};

export async function compressImage(image: File) {
  const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
  };

  return await imageCompression(image, options);
}