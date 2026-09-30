const DEFAULT_BRANDING = {
  logoUrl: '',
  loginBackgroundUrl: '',
  appBackgroundUrl: '',
  primaryColor: '#1a4731',
  secondaryColor: '#d35400',
  accentColor: '#2c3e50',
  textColor: '#ecf0f1'
};

const BRANDING_STORAGE_KEY = 'ark-branding';

export const getDefaultBranding = () => ({ ...DEFAULT_BRANDING });

export const resolveBranding = (group) => {
  const branding = group?.branding || {};
  return {
    logoUrl: branding.logoUrl || DEFAULT_BRANDING.logoUrl,
    loginBackgroundUrl: branding.loginBackgroundUrl || DEFAULT_BRANDING.loginBackgroundUrl,
    appBackgroundUrl: branding.appBackgroundUrl || DEFAULT_BRANDING.appBackgroundUrl,
    primaryColor: branding.primaryColor || DEFAULT_BRANDING.primaryColor,
    secondaryColor: branding.secondaryColor || DEFAULT_BRANDING.secondaryColor,
    accentColor: branding.accentColor || DEFAULT_BRANDING.accentColor,
    textColor: branding.textColor || DEFAULT_BRANDING.textColor
  };
};

export const persistBranding = (branding) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
  } catch (error) {
    console.error('Unable to persist branding:', error);
  }
};

export const readPersistedBranding = () => {
  if (typeof window === 'undefined') return getDefaultBranding();
  try {
    const value = window.localStorage.getItem(BRANDING_STORAGE_KEY);
    if (!value) return getDefaultBranding();
    const parsed = JSON.parse(value);
    return {
      ...getDefaultBranding(),
      ...parsed
    };
  } catch (error) {
    console.error('Unable to read persisted branding:', error);
    return getDefaultBranding();
  }
};

export const clearPersistedBranding = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(BRANDING_STORAGE_KEY);
  } catch (error) {
    console.error('Unable to clear persisted branding:', error);
  }
};

export const applyBrandingToDocument = (brandingInput) => {
  if (typeof document === 'undefined') return;
  const branding = {
    ...getDefaultBranding(),
    ...(brandingInput || {})
  };

  const root = document.documentElement;
  root.style.setProperty('--brand-primary', branding.primaryColor);
  root.style.setProperty('--brand-secondary', branding.secondaryColor);
  root.style.setProperty('--brand-accent', branding.accentColor);
  root.style.setProperty('--brand-text', branding.textColor);
  root.style.setProperty('--brand-logo-url', branding.logoUrl ? `url("${branding.logoUrl}")` : 'none');
  root.style.setProperty('--brand-login-bg-url', branding.loginBackgroundUrl ? `url("${branding.loginBackgroundUrl}")` : 'none');
  root.style.setProperty('--brand-app-bg-url', branding.appBackgroundUrl ? `url("${branding.appBackgroundUrl}")` : 'none');

  persistBranding(branding);
};

export const applyBrandingFromUser = (user) => {
  if (user?.group?.branding) {
    applyBrandingToDocument(resolveBranding(user.group));
    return;
  }

  applyBrandingToDocument(readPersistedBranding());
};
