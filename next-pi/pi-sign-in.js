(() => {
  const button = document.querySelector('#pi-sign-in');
  const status = document.querySelector('#pi-status');
  let initialization;
  let session;

  button.addEventListener('click', async () => {
    if (session) {
      session = undefined;
      button.textContent = 'Sign in with Pi';
      status.textContent = 'Signed out.';
      return;
    }
    if (!window.Pi) {
      status.textContent = 'Open NEXT in Pi Browser to sign in.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Signing in…';
    try {
      initialization ??= Promise.resolve().then(() => window.Pi.init({version: '2.0'})).catch(error => {
        initialization = undefined;
        throw error;
      });
      await initialization;
      const {accessToken} = await window.Pi.authenticate(['username'], () => {
        // The preview does not process payments.
      });
      if (!accessToken) throw new Error('Missing access token');
      const response = await fetch('https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'omit',
        body: JSON.stringify({accessToken})
      });
      if (!response.ok) throw new Error('Pi could not verify the account');
      const verified = await response.json();
      if (!verified.sessionToken || !verified.user?.uid || !verified.user?.username) {
        throw new Error('Unexpected sign-in response');
      }
      session = verified;
      status.textContent = 'Signed in as @' + session.user.username;
      button.textContent = 'Sign out';
    } catch {
      status.textContent = 'Pi sign-in could not finish. Open NEXT in Pi Browser and try again.';
    } finally {
      button.disabled = false;
    }
  });
})();