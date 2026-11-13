import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, comparePassword } from '../../../src/utils/password.util';

describe('Pruebas de utilitarios de contraseñas', () => {
  const password1 = "ClaveUno123!";
  const password2 = "ClaveDos456!";
  let hash1: string;
  let hash2: string;

  // Generamos los hashes antes de ejecutar los casos de prueba
  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('debe generar hashes como cadenas no vacías y diferentes de la contraseña original', () => {
    // Revisar hash1 y hash2
    expect(hash1).toBeTruthy();
    expect(typeof hash1).toBe('string');
    expect(hash1).not.toBe(password1); // Diferente de su contraseña original

    expect(hash2).toBeTruthy();
    expect(typeof hash2).toBe('string');
    expect(hash2).not.toBe(password2); // Diferente de su contraseña original[cite: 1]
  });

  it('debe devolver true al comparar la contraseña correcta con su hash', async () => {
    // Ejecutar comparePassword(password1, hash1) y comparePassword(password2, hash2)[cite: 1]
    const match1 = await comparePassword(password1, hash1);
    const match2 = await comparePassword(password2, hash2);

    // Ambas comparaciones devuelven true[cite: 1]
    expect(match1).toBe(true);
    expect(match2).toBe(true);
  });

  it('debe devolver false al comparar una contraseña incorrecta', async () => {
    // Ejecutar comparePassword(password2, hash1) y comparePassword(password1, hash2)[cite: 1]
    const match1 = await comparePassword(password2, hash1);
    const match2 = await comparePassword(password1, hash2);

    // Ambas comparaciones devuelven false[cite: 1]
    expect(match1).toBe(false);
    expect(match2).toBe(false);
  });
});