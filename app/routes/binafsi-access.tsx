import { useState, type FormEvent } from 'react';
import LivingAtmosphere from '../components/binafsi/LivingAtmosphere';

/**
 * BINAFSI-branded access screen. Uses the existing Agent-Native/Better Auth
 * browser endpoints. No credentials are stored in localStorage or app DB.
 * The framework's /sign-in page remains available as a fallback.
 */
type Mode = 'register' | 'login';
type AuthError = { message?: string; error?: string; code?: string };

export default function BinafsiAccess() {
  const [mode, setMode] = useState<Mode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setNotice('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) { setNotice('Enter your email and password.'); return; }
    if (mode === 'register' && (!name.trim() || password.length < 8)) {
      setNotice('Enter your name and choose a password of at least 8 characters.'); return;
    }
    setBusy(true);
    try {
      // These are Better Auth's standard same-origin, cookie-based endpoints.
      const endpoint = mode === 'register'
        ? '/_agent-native/auth/ba/sign-up/email'
        : '/_agent-native/auth/ba/sign-in/email';
      const payload = mode === 'register'
        ? { name: name.trim(), email: normalizedEmail, password }
        : { email: normalizedEmail, password };
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result: AuthError = await response.json().catch(() => ({}));
      if (!response.ok) {
        // Avoid surfacing implementation details or echoing credentials.
        const message = result.message || result.error;
        setNotice(message && message.length < 250 ? message : 'Account access failed. Please check the details or use the secure sign-in option below.');
        return;
      }
      setPassword('');
      // Email verification may be required in production; respect that rather
      // than interpreting a successful signup response as an authenticated session.
      const sessionResponse = await fetch('/_agent-native/auth/session', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!sessionResponse.ok) {
        setNotice('Account request accepted. Complete any email verification, then sign in.');
        setMode('login');
        return;
      }
      const session = await sessionResponse.json().catch(() => null);
      if (session && (session.email || session.user || session.session?.user || session.session?.email)) {
        window.location.assign('/binafsi');
      } else {
        setNotice('Account request accepted. Check your email for verification if required, then sign in.');
        setMode('login');
      }
    } catch {
      setNotice('Could not reach the sign-in service. Check the server connection or use the secure sign-in link below.');
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setNotice('');
    setPassword('');
  }

  return <>
    <link rel="stylesheet" href="/binafsi/styles.css" />
    <link rel="stylesheet" href="/binafsi/auth.css" />
    <main className="bf-auth-page binafsi-cinema">
      <LivingAtmosphere mode="access" />
      <div className="bf-auth-overlay" aria-hidden="true" />
      <header className="bf-auth-top">
        <a href="/binafsi-welcome" className="bf-auth-brand" aria-label="BINAFSI home"><span aria-hidden="true">✧</span> BINAFSI</a>
        <a className="bf-auth-back" href="/binafsi-welcome">← Back to home</a>
      </header>
      <div className="bf-auth-layout">
        <section className="bf-auth-story" aria-label="About BINAFSI">
          <div className="bf-auth-eyebrow">PERSONAL INTELLIGENCE · HUMAN CONTROL</div>
          <h1>Your world.<br /><em>Beautifully connected.</em></h1>
          <p>Bring your plans, memories, goals and decisions together in one thoughtful place. Explore consequences. Keep the final say.</p>
          <div className="bf-auth-points"><span>✦ Living Memory</span><span>✦ Decision Twin</span><span>✦ Your daily plan</span></div>
        </section>
        <section className="bf-auth-card" aria-labelledby="bf-auth-heading">
          <div className="bf-auth-overline">WELCOME TO BINAFSI</div>
          <h2 id="bf-auth-heading">{mode === 'register' ? 'Begin your next chapter.' : 'Welcome back.'}</h2>
          <p className="bf-auth-subtitle">{mode === 'register' ? 'Create your personal workspace.' : 'Sign in to your personal workspace.'}</p>
          <div className="bf-auth-tabs" role="group" aria-label="Account access mode">
            <button type="button" className={mode === 'register' ? 'selected' : ''} aria-pressed={mode === 'register'} onClick={() => switchMode('register')}>Create account</button>
            <button type="button" className={mode === 'login' ? 'selected' : ''} aria-pressed={mode === 'login'} onClick={() => switchMode('login')}>Sign in</button>
          </div>
          <form className="bf-auth-form" onSubmit={submit}>
            {mode === 'register' && <label>Full name<input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="How should we address you?" required maxLength={100} /></label>}
            <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={254} /></label>
            <label>Password<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'} required minLength={mode === 'register' ? 8 : 1} /></label>
            {notice && <p className="bf-auth-message" role="status">{notice}</p>}
            <button type="submit" className="bf-auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create my account →' : 'Sign in →'}</button>
          </form>
          <div className="bf-auth-footer">
            <p>Prefer a magic link or another sign-in method?</p>
            <a href="/sign-in?return=%2Fbinafsi">Use secure sign-in options ↗</a>
          </div>
          <p className="bf-auth-privacy">Your password is handled by the app's existing Better Auth service. BINAFSI never saves it in your workspace records.</p>
        </section>
      </div>
    </main>
  </>;
}
