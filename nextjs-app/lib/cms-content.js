/**
 * CMS content blocks used by several pages (server only). Same sources and
 * caching as before the redesign (they lived inside the leistungen/kontakt
 * page files): content keys "services" and "contact-settings", fetched from
 * the backend container with 60 s ISR. During `next build` (no BACKEND_URL)
 * they return null and the pages render without the CMS-only sections until
 * the first revalidation.
 */
import { getAllTeamMembers } from './api/team';

async function getContentValue(key) {
  if (!process.env.BACKEND_URL) return null;
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/content/${key}`, {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      console.error(`Failed to fetch CMS content "${key}":`, response.status);
      return null;
    }
    const data = await response.json();
    return data?.value ? JSON.parse(data.value) : null;
  } catch (error) {
    console.error(`Error fetching CMS content "${key}":`, error.message);
    return null;
  }
}

/** { services: [...], processSteps: [...], categories: [...] } or null */
export function getServicesConfig() {
  return getContentValue('services');
}

/** { officeInfo, openingHours, socialLinks, ... } or null */
export function getContactSettings() {
  return getContentValue('contact-settings');
}

/** Active team members, ordered as in the CMS. Never throws. */
export async function getTeam(lang) {
  try {
    const members = await getAllTeamMembers(lang);
    return (Array.isArray(members) ? members : [])
      .filter((m) => m && m.name && m.is_active !== 0)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  } catch {
    return [];
  }
}
