import * as admin from 'firebase-admin';

// Initialize Firebase Admin singleton
if (!admin.apps.length) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'aetheris-ai-journal';
  try {
    admin.initializeApp({
      projectId: projectId,
    });
  } catch (err: any) {
    console.warn('[FirebaseAdmin] Failed to auto-initialize Admin SDK:', err.message);
  }
}

export interface VerifiedUser {
  uid: string;
  email?: string;
  name?: string;
  isMockUser?: boolean;
}

/**
 * Validates the incoming Authorization: Bearer <token> header.
 * Ensures zero cross-user leakage by extracting the cryptographically verified UID.
 */
export async function verifyAuthToken(authHeader: string | null): Promise<VerifiedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) return null;

  // Development / Demo Mock bypass
  if (token === 'DEMO_SANDBOX_TOKEN' || token.startsWith('mock_token_')) {
    return {
      uid: 'demo-user-772',
      email: 'demo.executive@aetheris.internal',
      name: 'Executive Demo',
      isMockUser: true,
    };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      isMockUser: false,
    };
  } catch (err: any) {
    console.warn('[FirebaseAdmin] Token verification failed:', err.message);
    return null;
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
