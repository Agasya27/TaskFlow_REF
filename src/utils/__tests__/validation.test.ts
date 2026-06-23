import {
  validateEmail,
  validatePassword,
  validateTaskTitle,
} from '@utils/validation';

describe('validateEmail', () => {
  it('returns error when empty', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error for invalid format', () => {
    expect(validateEmail('notanemail')).toBe('Enter a valid email address');
    expect(validateEmail('missing@domain')).toBe('Enter a valid email address');
  });

  it('returns null for valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('returns error when empty', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('returns error when too short', () => {
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
  });

  it('returns null for valid password', () => {
    expect(validatePassword('secret')).toBeNull();
  });
});

describe('validateTaskTitle', () => {
  it('returns error when empty', () => {
    expect(validateTaskTitle('')).toBe('Title is required');
    expect(validateTaskTitle('  ')).toBe('Title is required');
  });

  it('returns error when too short', () => {
    expect(validateTaskTitle('ab')).toBe('Title must be at least 3 characters');
  });

  it('returns error when too long', () => {
    expect(validateTaskTitle('a'.repeat(101))).toBe('Title must be under 100 characters');
  });

  it('returns null for valid title', () => {
    expect(validateTaskTitle('Buy groceries')).toBeNull();
  });
});
