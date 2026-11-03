import { getAuth } from 'firebase/auth';
import { Notify } from 'quasar';

async function userConnection() {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid;
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }
  const token = await user.getIdToken();

  return {
    token,
    uid,
  };
}

export async function useSentToOcr(screenshot: ImageData | string, APIRoute: string) {
  try {
    const { token, uid } = await userConnection();
    const response = await fetch(`${process.env.API}${APIRoute}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageBase64: screenshot, user: { uid } }),
    });

    const data = await response.json();

    return data.text;
  } catch (err) {
    Notify.create({
      message: 'Error: extracting text.',
      color: 'negative',
      icon: 'system_update',
      timeout: 3000,
    });
  }
}
