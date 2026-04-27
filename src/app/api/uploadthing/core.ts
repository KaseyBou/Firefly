import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/auth';

const f = createUploadthing();

export const ourFileRouter = {
  // This name "imageUploader" is used in your frontend component
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
