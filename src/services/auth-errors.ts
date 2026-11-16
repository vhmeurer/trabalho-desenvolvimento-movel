import { FirebaseError } from 'firebase/app';

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Não existe conta com esse e-mail.',
  'auth/invalid-email': 'Informe um e-mail válido.',
  'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
  'auth/weak-password': 'A senha é fraca demais.',
  'auth/missing-password': 'Informe sua senha.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique sua rede e tente de novo.',
  'auth/user-disabled': 'Essa conta foi desativada.',
  'auth/invalid-api-key': 'O Firebase não está configurado. Confira o arquivo .env.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'O Firebase não está configurado. Confira o arquivo .env.',
  'auth/operation-not-allowed': 'O login por e-mail e senha não está ativado no Firebase.',
};

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && MESSAGES[error.code]) return MESSAGES[error.code];
  return 'Não foi possível concluir agora. Tente novamente.';
}
