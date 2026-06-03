import { ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage'
import { storage } from './config'

export async function uploadFile(
  path: string, file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, path)
  const task = uploadBytesResumable(storageRef, file)
  return new Promise((resolve, reject) => {
    task.on('state_changed',
      snap => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    )
  })
}

export const deleteFile = (path: string) => deleteObject(ref(storage, path))

export const courseThumbPath  = (courseId: string) => `courses/${courseId}/thumbnail`
export const lessonVideoPath  = (courseId: string, lessonId: string) => `courses/${courseId}/lessons/${lessonId}/video`
export const resourcePath     = (courseId: string, fileName: string) => `courses/${courseId}/resources/${fileName}`
export const avatarPath       = (uid: string) => `users/${uid}/avatar`
export const uploadProfileImage = async (
  uid: string,
  file: File
) => {
  const imageRef = ref(storage, `avatars/${uid}/${Date.now()}-${file.name}`)

  await uploadBytes(imageRef, file)

  return await getDownloadURL(imageRef)
}