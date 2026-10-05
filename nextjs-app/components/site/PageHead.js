import Breadcrumbs from './Breadcrumbs';

/**
 * Page title block on the 12-column grid: breadcrumbs, the page's single h1
 * (columns 1–7) and an optional aside (columns 8–12).
 */
export default function PageHead({ title, aside, crumbs, crumbsLabel, titleClass = 't-h1' }) {
  return (
    <div className="wrap cols page-head">
      <Breadcrumbs items={crumbs} label={crumbsLabel} />
      <h1 className={titleClass}>{title}</h1>
      {aside && <div className="page-aside">{typeof aside === 'string' ? <p>{aside}</p> : aside}</div>}
    </div>
  );
}
