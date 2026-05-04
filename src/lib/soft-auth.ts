// [path]: lib/soft-auth.ts
// Demo-only PINs for workshop tablets (not security-hardened).

export const SOFT_LOGIN_PASSWORDS: Record<string, string> = {
  'user-boss': '911',
  'user-staff-marius': '02',
  'user-staff-jovan': '20',
};

export function verifySoftLogin(userId: string, password: string): boolean {
  const expected = SOFT_LOGIN_PASSWORDS[userId];
  if (!expected) return false;
  return password.trim() === expected;
}
