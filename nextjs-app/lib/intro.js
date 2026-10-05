import { i18n } from './i18n';

/** sessionStorage key: the intro overlay was shown in this browser session. */
export const INTRO_FLAG = 'be-intro-seen';

/** window event fired when the intro overlay has been dismissed. */
export const INTRO_DONE_EVENT = 'be:intro-done';

/**
 * Inline <head> script (app/[lang]/layout.js). Runs before first paint and
 * only flags the document: on a hard load of exactly /{lang}, without a
 * #fragment, not coming from another page of this site, and not yet seen in
 * this session, it adds `html.intro-pending`. CSS turns that class into a
 * black cover until components/home/EntryOverlay.js takes over (or fades the
 * cover out after 5 s if it never does). It never hides or changes content.
 */
export const INTRO_BOOT = `(function(){try{var d=document.documentElement,l=location;if(!/^\\/(${i18n.locales.join('|')})\\/?$/.test(l.pathname)||l.hash)return;if(sessionStorage.getItem('${INTRO_FLAG}'))return;var r=document.referrer;if(r&&r.indexOf(l.origin+'/')===0)return;d.classList.add('intro-pending')}catch(e){}})();`;
