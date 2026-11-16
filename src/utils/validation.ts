const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type PasswordRule = {
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  { label: 'Pelo menos 8 caracteres', test: (password) => password.length >= 8 },
  { label: 'Uma letra maiúscula', test: (password) => /[A-Z]/.test(password) },
  { label: 'Uma letra minúscula', test: (password) => /[a-z]/.test(password) },
  { label: 'Um número', test: (password) => /\d/.test(password) },
  { label: 'Um caractere especial (!@#$%...)', test: (password) => /[^A-Za-z0-9\s]/.test(password) },
];

export function validateName(name: string): string {
  const value = name.trim();
  if (value === '') return 'Informe seu nome.';
  if (value.length < 2) return 'O nome deve ter pelo menos 2 letras.';
  return '';
}

export function validateEmail(email: string): string {
  const value = email.trim();
  if (value === '') return 'Informe seu e-mail.';
  if (!EMAIL_PATTERN.test(value)) return 'Informe um e-mail válido, como voce@exemplo.com.';
  return '';
}

export function validateNewPassword(password: string): string {
  if (password.length === 0) return 'Crie uma senha.';
  if (PASSWORD_RULES.some((rule) => !rule.test(password))) return 'A senha não atende a todos os requisitos.';
  return '';
}

export function validatePasswordConfirmation(password: string, confirmation: string): string {
  if (confirmation.length === 0) return 'Confirme sua senha.';
  if (confirmation !== password) return 'As senhas não coincidem.';
  return '';
}
