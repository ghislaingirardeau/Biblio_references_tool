import { getAuth } from 'firebase/auth';
import { Notify } from 'quasar';
import type { Quote } from 'src/types/references';

export async function useSentToOcr(screenshot: ImageData, newQuote: Quote, toDoNext: () => void) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user!.getIdToken();
    const response = await fetch(`${process.env.API}/ocrCapture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageBase64: screenshot, user: { uid: user?.uid } }),
    });

    const data = await response.json();

    newQuote.content = data.text;

    toDoNext();
  } catch (err) {
    Notify.create({
      message: 'Error: extracting text.',
      color: 'negative',
      icon: 'system_update',
      timeout: 3000,
    });
  }
}
