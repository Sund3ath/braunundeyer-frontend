/**
 * Per-route, per-language titles and meta descriptions.
 *
 * German (de) is the indexable language; its copy follows the keyword map in
 * SEO-AUDIT.md §5. The other languages carry sensible translations so their
 * <title>/<meta description> are not German, but those locales are currently
 * noindex (see INDEXABLE_LOCALES in lib/seo.js) until the page content itself
 * is translated.
 *
 * Rules: titles <= 60 characters, descriptions <= 160 characters, no
 * unverifiable claims ("500+ Projekte", "100 % Kundenzufriedenheit", ...).
 *
 * `title` is used as-is when `absoluteTitle: true`; otherwise the layout's
 * title template appends the brand ("%s | Braun & Eyer Architekten").
 */
import { SITE } from './site';

const Y = SITE.foundingYear;
const ADDR = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`;

export const SEO_COPY = {
  de: {
    brand: 'Braun & Eyer Architekten',
    defaultTitle: 'Braun & Eyer Architekten | Architekturbüro Saarbrücken',
    defaultDescription: `Braun & Eyer Architekten – Architekturbüro in Saarbrücken seit ${Y}: Neubau, Altbausanierung, Denkmalschutz und Innenarchitektur im Saarland.`,
    orgDescription: `Architekturbüro in Saarbrücken seit ${Y}: Planung von Neubau, Altbausanierung, Denkmalschutz und Innenarchitektur im Saarland.`,
    home: {
      title: 'Architekt in Saarbrücken – Braun & Eyer Architekten',
      absoluteTitle: true,
      description: `Braun & Eyer Architekten – Architekturbüro in Saarbrücken seit ${Y}: Neubau, Altbausanierung, Denkmalschutz und Innenarchitektur im Saarland.`,
      h1: 'Architekturbüro in Saarbrücken für Neubau, Altbausanierung und Denkmalschutz',
    },
    projects: {
      title: 'Projekte & Referenzen im Saarland | Braun & Eyer',
      absoluteTitle: true,
      description: 'Ausgewählte Projekte von Braun & Eyer Architekten: Bürogebäude, Wohnungsbau, Altbausanierung und Arztpraxen in Saarbrücken und im Saarland.',
    },
    project: {
      byline: 'Ein Projekt von Braun & Eyer Architekten, Saarbrücken.',
      imageLabel: 'Bild',
      notFoundTitle: 'Projekt nicht gefunden',
    },
    services: {
      title: 'Leistungen: Neubau, Sanierung, Denkmalschutz | Braun & Eyer',
      absoluteTitle: true,
      description: 'Neubau, Altbausanierung, Denkmalschutz, Innenarchitektur und Energieberatung: Planung bis zur Bauüberwachung – Braun & Eyer Architekten, Saarbrücken.',
    },
    about: {
      title: 'Über uns – Architekten Braun & Eyer, Saarbrücken',
      absoluteTitle: true,
      description: `Seit ${Y} planen die Architekten Christian F. Braun und Patric Eyer in Saarbrücken – Neubau, Altbausanierung und Denkmalschutz im Saarland.`,
    },
    contact: {
      title: 'Kontakt – Braun & Eyer Architekten, Saarbrücken',
      absoluteTitle: true,
      description: `Braun & Eyer Architekten, ${ADDR}. Telefon ${SITE.phone.national} – vereinbaren Sie ein Erstgespräch zu Ihrem Bauvorhaben.`,
    },
    gallery: {
      title: 'Galerie',
      description: 'Fotos ausgewählter Projekte von Braun & Eyer Architekten aus Saarbrücken und dem Saarland.',
    },
    imprint: {
      title: 'Impressum',
      description: `Impressum der ${SITE.legalName}, ${ADDR}: Anbieterkennzeichnung, Berufsrecht und Berufshaftpflichtversicherung.`,
    },
    privacy: {
      title: 'Datenschutzerklärung',
      description: `Datenschutzerklärung der ${SITE.legalName}: welche Daten diese Website verarbeitet, zu welchem Zweck und welche Rechte Sie haben.`,
    },
    notFound: {
      title: 'Seite nicht gefunden',
      heading: 'Diese Seite gibt es nicht (mehr).',
      text: 'Die Adresse ist falsch geschrieben oder die Seite wurde verschoben.',
      home: 'Zur Startseite',
      projects: 'Projekte',
      contact: 'Kontakt',
    },
    breadcrumb: {
      home: 'Startseite', projects: 'Projekte', services: 'Leistungen', about: 'Über uns',
      contact: 'Kontakt', gallery: 'Galerie', imprint: 'Impressum', privacy: 'Datenschutz',
    },
  },

  en: {
    brand: 'Braun & Eyer Architects',
    defaultTitle: 'Braun & Eyer Architects | Architecture Office Saarbrücken',
    defaultDescription: `Braun & Eyer Architects – architecture office in Saarbrücken since ${Y}: new buildings, renovation of existing buildings, listed buildings and interiors.`,
    orgDescription: `Architecture office in Saarbrücken since ${Y}: new buildings, renovation of existing buildings, listed buildings and interior design in Saarland.`,
    home: {
      title: 'Architect in Saarbrücken – Braun & Eyer Architects',
      absoluteTitle: true,
      description: `Braun & Eyer Architects – architecture office in Saarbrücken since ${Y}: new buildings, renovation, listed buildings and interior design in Saarland.`,
      h1: 'Architecture office in Saarbrücken for new buildings, renovation and listed buildings',
    },
    projects: {
      title: 'Projects & References in Saarland | Braun & Eyer',
      absoluteTitle: true,
      description: 'Selected projects by Braun & Eyer Architects: office buildings, housing, renovation and medical practices in Saarbrücken and Saarland.',
    },
    project: {
      byline: 'A project by Braun & Eyer Architects, Saarbrücken.',
      imageLabel: 'Image',
      notFoundTitle: 'Project not found',
    },
    services: {
      title: 'Services: New Build, Renovation, Heritage | Braun & Eyer',
      absoluteTitle: true,
      description: 'New buildings, renovation, listed buildings, interior design and energy consulting – Braun & Eyer Architects, Saarbrücken.',
    },
    about: {
      title: 'About – Braun & Eyer Architects, Saarbrücken',
      absoluteTitle: true,
      description: `Since ${Y}, architects Christian F. Braun and Patric Eyer have been designing buildings in Saarbrücken and Saarland.`,
    },
    contact: {
      title: 'Contact – Braun & Eyer Architects, Saarbrücken',
      absoluteTitle: true,
      description: `Braun & Eyer Architects, ${ADDR}, Germany. Phone ${SITE.phone.display} – get in touch to discuss your project.`,
    },
    gallery: {
      title: 'Gallery',
      description: 'Photos of selected projects by Braun & Eyer Architects from Saarbrücken and Saarland.',
    },
    imprint: {
      title: 'Legal notice',
      description: `Legal notice (Impressum) of ${SITE.legalName}, ${ADDR}.`,
    },
    privacy: {
      title: 'Privacy policy',
      description: `Privacy policy of ${SITE.legalName}: which data this website processes, why, and what rights you have.`,
    },
    notFound: {
      title: 'Page not found',
      heading: 'This page does not exist.',
      text: 'The address may be mistyped or the page has moved.',
      home: 'Go to the homepage',
      projects: 'Projects',
      contact: 'Contact',
    },
    breadcrumb: {
      home: 'Home', projects: 'Projects', services: 'Services', about: 'About us',
      contact: 'Contact', gallery: 'Gallery', imprint: 'Legal notice', privacy: 'Privacy',
    },
  },

  fr: {
    brand: 'Braun & Eyer Architectes',
    defaultTitle: "Braun & Eyer Architectes | Bureau d'architecture Sarrebruck",
    defaultDescription: `Braun & Eyer Architectes – bureau d'architecture à Sarrebruck depuis ${Y} : construction neuve, rénovation, monuments historiques et architecture intérieure.`,
    orgDescription: `Bureau d'architecture à Sarrebruck depuis ${Y} : construction neuve, rénovation, monuments historiques et architecture intérieure en Sarre.`,
    home: {
      title: 'Architecte à Sarrebruck – Braun & Eyer Architectes',
      absoluteTitle: true,
      description: `Braun & Eyer Architectes – bureau d'architecture à Sarrebruck depuis ${Y} : construction neuve, rénovation et monuments historiques en Sarre.`,
      h1: "Bureau d'architecture à Sarrebruck : construction neuve, rénovation et monuments historiques",
    },
    projects: {
      title: 'Projets et références en Sarre | Braun & Eyer',
      absoluteTitle: true,
      description: 'Projets choisis de Braun & Eyer Architectes : bureaux, logements, rénovations et cabinets médicaux à Sarrebruck et en Sarre.',
    },
    project: {
      byline: 'Un projet de Braun & Eyer Architectes, Sarrebruck.',
      imageLabel: 'Image',
      notFoundTitle: 'Projet introuvable',
    },
    services: {
      title: 'Prestations : neuf, rénovation, patrimoine | Braun & Eyer',
      absoluteTitle: true,
      description: 'Construction neuve, rénovation, monuments historiques, architecture intérieure et conseil énergétique – Braun & Eyer Architectes, Sarrebruck.',
    },
    about: {
      title: 'À propos – Braun & Eyer Architectes, Sarrebruck',
      absoluteTitle: true,
      description: `Depuis ${Y}, les architectes Christian F. Braun et Patric Eyer conçoivent des bâtiments à Sarrebruck et en Sarre.`,
    },
    contact: {
      title: 'Contact – Braun & Eyer Architectes, Sarrebruck',
      absoluteTitle: true,
      description: `Braun & Eyer Architectes, ${ADDR}, Allemagne. Téléphone ${SITE.phone.display} – parlons de votre projet.`,
    },
    gallery: {
      title: 'Galerie',
      description: 'Photos de projets choisis de Braun & Eyer Architectes à Sarrebruck et en Sarre.',
    },
    imprint: {
      title: 'Mentions légales',
      description: `Mentions légales (Impressum) de ${SITE.legalName}, ${ADDR}.`,
    },
    privacy: {
      title: 'Protection des données',
      description: `Politique de confidentialité de ${SITE.legalName} : données traitées, finalités et vos droits.`,
    },
    notFound: {
      title: 'Page introuvable',
      heading: "Cette page n'existe pas.",
      text: "L'adresse est peut-être mal saisie ou la page a été déplacée.",
      home: "Aller à l'accueil",
      projects: 'Projets',
      contact: 'Contact',
    },
    breadcrumb: {
      home: 'Accueil', projects: 'Projets', services: 'Prestations', about: 'À propos',
      contact: 'Contact', gallery: 'Galerie', imprint: 'Mentions légales', privacy: 'Confidentialité',
    },
  },

  it: {
    brand: 'Braun & Eyer Architetti',
    defaultTitle: 'Braun & Eyer Architetti | Studio di architettura Saarbrücken',
    defaultDescription: `Braun & Eyer Architetti – studio di architettura a Saarbrücken dal ${Y}: nuove costruzioni, ristrutturazioni, edifici storici e interni.`,
    orgDescription: `Studio di architettura a Saarbrücken dal ${Y}: nuove costruzioni, ristrutturazioni, edifici vincolati e architettura d'interni nel Saarland.`,
    home: {
      title: 'Architetto a Saarbrücken – Braun & Eyer Architetti',
      absoluteTitle: true,
      description: `Braun & Eyer Architetti – studio di architettura a Saarbrücken dal ${Y}: nuove costruzioni, ristrutturazioni ed edifici vincolati nel Saarland.`,
      h1: 'Studio di architettura a Saarbrücken: nuove costruzioni, ristrutturazioni ed edifici storici',
    },
    projects: {
      title: 'Progetti e referenze nel Saarland | Braun & Eyer',
      absoluteTitle: true,
      description: 'Progetti scelti di Braun & Eyer Architetti: uffici, residenze, ristrutturazioni e studi medici a Saarbrücken e nel Saarland.',
    },
    project: {
      byline: 'Un progetto di Braun & Eyer Architetti, Saarbrücken.',
      imageLabel: 'Immagine',
      notFoundTitle: 'Progetto non trovato',
    },
    services: {
      title: 'Servizi: nuove costruzioni, ristrutturazioni | Braun & Eyer',
      absoluteTitle: true,
      description: "Nuove costruzioni, ristrutturazioni, edifici vincolati, architettura d'interni e consulenza energetica – Braun & Eyer Architetti, Saarbrücken.",
    },
    about: {
      title: 'Chi siamo – Braun & Eyer Architetti, Saarbrücken',
      absoluteTitle: true,
      description: `Dal ${Y} gli architetti Christian F. Braun e Patric Eyer progettano edifici a Saarbrücken e nel Saarland.`,
    },
    contact: {
      title: 'Contatti – Braun & Eyer Architetti, Saarbrücken',
      absoluteTitle: true,
      description: `Braun & Eyer Architetti, ${ADDR}, Germania. Telefono ${SITE.phone.display} – parliamo del vostro progetto.`,
    },
    gallery: {
      title: 'Galleria',
      description: 'Foto di progetti scelti di Braun & Eyer Architetti a Saarbrücken e nel Saarland.',
    },
    imprint: {
      title: 'Note legali',
      description: `Note legali (Impressum) di ${SITE.legalName}, ${ADDR}.`,
    },
    privacy: {
      title: 'Informativa sulla privacy',
      description: `Informativa sulla privacy di ${SITE.legalName}: quali dati tratta questo sito, perché e quali diritti avete.`,
    },
    notFound: {
      title: 'Pagina non trovata',
      heading: 'Questa pagina non esiste.',
      text: "L'indirizzo potrebbe essere errato oppure la pagina è stata spostata.",
      home: 'Vai alla home page',
      projects: 'Progetti',
      contact: 'Contatti',
    },
    breadcrumb: {
      home: 'Home', projects: 'Progetti', services: 'Servizi', about: 'Chi siamo',
      contact: 'Contatti', gallery: 'Galleria', imprint: 'Note legali', privacy: 'Privacy',
    },
  },

  es: {
    brand: 'Braun & Eyer Arquitectos',
    defaultTitle: 'Braun & Eyer Arquitectos | Estudio de arquitectura Saarbrücken',
    defaultDescription: `Braun & Eyer Arquitectos – estudio de arquitectura en Saarbrücken desde ${Y}: obra nueva, rehabilitación, patrimonio e interiorismo.`,
    orgDescription: `Estudio de arquitectura en Saarbrücken desde ${Y}: obra nueva, rehabilitación, edificios protegidos e interiorismo en el Sarre.`,
    home: {
      title: 'Arquitecto en Saarbrücken – Braun & Eyer Arquitectos',
      absoluteTitle: true,
      description: `Braun & Eyer Arquitectos – estudio de arquitectura en Saarbrücken desde ${Y}: obra nueva, rehabilitación y edificios protegidos en el Sarre.`,
      h1: 'Estudio de arquitectura en Saarbrücken: obra nueva, rehabilitación y patrimonio',
    },
    projects: {
      title: 'Proyectos y referencias en el Sarre | Braun & Eyer',
      absoluteTitle: true,
      description: 'Proyectos seleccionados de Braun & Eyer Arquitectos: oficinas, viviendas, rehabilitaciones y consultas médicas en Saarbrücken y el Sarre.',
    },
    project: {
      byline: 'Un proyecto de Braun & Eyer Arquitectos, Saarbrücken.',
      imageLabel: 'Imagen',
      notFoundTitle: 'Proyecto no encontrado',
    },
    services: {
      title: 'Servicios: obra nueva, rehabilitación | Braun & Eyer',
      absoluteTitle: true,
      description: 'Obra nueva, rehabilitación, edificios protegidos, interiorismo y asesoría energética – Braun & Eyer Arquitectos, Saarbrücken.',
    },
    about: {
      title: 'Quiénes somos – Braun & Eyer Arquitectos',
      absoluteTitle: true,
      description: `Desde ${Y}, los arquitectos Christian F. Braun y Patric Eyer proyectan edificios en Saarbrücken y el Sarre.`,
    },
    contact: {
      title: 'Contacto – Braun & Eyer Arquitectos, Saarbrücken',
      absoluteTitle: true,
      description: `Braun & Eyer Arquitectos, ${ADDR}, Alemania. Teléfono ${SITE.phone.display} – hablemos de su proyecto.`,
    },
    gallery: {
      title: 'Galería',
      description: 'Fotos de proyectos seleccionados de Braun & Eyer Arquitectos en Saarbrücken y el Sarre.',
    },
    imprint: {
      title: 'Aviso legal',
      description: `Aviso legal (Impressum) de ${SITE.legalName}, ${ADDR}.`,
    },
    privacy: {
      title: 'Política de privacidad',
      description: `Política de privacidad de ${SITE.legalName}: qué datos trata este sitio, con qué fin y cuáles son sus derechos.`,
    },
    notFound: {
      title: 'Página no encontrada',
      heading: 'Esta página no existe.',
      text: 'Puede que la dirección esté mal escrita o que la página se haya movido.',
      home: 'Ir a la página de inicio',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    breadcrumb: {
      home: 'Inicio', projects: 'Proyectos', services: 'Servicios', about: 'Quiénes somos',
      contact: 'Contacto', gallery: 'Galería', imprint: 'Aviso legal', privacy: 'Privacidad',
    },
  },

  pt: {
    brand: 'Braun & Eyer Arquitetos',
    defaultTitle: 'Braun & Eyer Arquitetos | Gabinete de arquitetura Saarbrücken',
    defaultDescription: `Braun & Eyer Arquitetos – gabinete de arquitetura em Saarbrücken desde ${Y}: construção nova, reabilitação, património e interiores.`,
    orgDescription: `Gabinete de arquitetura em Saarbrücken desde ${Y}: construção nova, reabilitação, edifícios classificados e arquitetura de interiores no Sarre.`,
    home: {
      title: 'Arquiteto em Saarbrücken – Braun & Eyer Arquitetos',
      absoluteTitle: true,
      description: `Braun & Eyer Arquitetos – gabinete de arquitetura em Saarbrücken desde ${Y}: construção nova, reabilitação e edifícios classificados no Sarre.`,
      h1: 'Gabinete de arquitetura em Saarbrücken: construção nova, reabilitação e património',
    },
    projects: {
      title: 'Projetos e referências no Sarre | Braun & Eyer',
      absoluteTitle: true,
      description: 'Projetos selecionados da Braun & Eyer Arquitetos: escritórios, habitação, reabilitação e consultórios médicos em Saarbrücken e no Sarre.',
    },
    project: {
      byline: 'Um projeto da Braun & Eyer Arquitetos, Saarbrücken.',
      imageLabel: 'Imagem',
      notFoundTitle: 'Projeto não encontrado',
    },
    services: {
      title: 'Serviços: construção nova, reabilitação | Braun & Eyer',
      absoluteTitle: true,
      description: 'Construção nova, reabilitação, edifícios classificados, arquitetura de interiores e consultoria energética – Braun & Eyer Arquitetos, Saarbrücken.',
    },
    about: {
      title: 'Sobre nós – Braun & Eyer Arquitetos, Saarbrücken',
      absoluteTitle: true,
      description: `Desde ${Y}, os arquitetos Christian F. Braun e Patric Eyer projetam edifícios em Saarbrücken e no Sarre.`,
    },
    contact: {
      title: 'Contacto – Braun & Eyer Arquitetos, Saarbrücken',
      absoluteTitle: true,
      description: `Braun & Eyer Arquitetos, ${ADDR}, Alemanha. Telefone ${SITE.phone.display} – fale connosco sobre o seu projeto.`,
    },
    gallery: {
      title: 'Galeria',
      description: 'Fotografias de projetos selecionados da Braun & Eyer Arquitetos em Saarbrücken e no Sarre.',
    },
    imprint: {
      title: 'Aviso legal',
      description: `Aviso legal (Impressum) da ${SITE.legalName}, ${ADDR}.`,
    },
    privacy: {
      title: 'Política de privacidade',
      description: `Política de privacidade da ${SITE.legalName}: que dados este site trata, para quê e quais os seus direitos.`,
    },
    notFound: {
      title: 'Página não encontrada',
      heading: 'Esta página não existe.',
      text: 'O endereço pode estar incorreto ou a página foi movida.',
      home: 'Ir para a página inicial',
      projects: 'Projetos',
      contact: 'Contacto',
    },
    breadcrumb: {
      home: 'Início', projects: 'Projetos', services: 'Serviços', about: 'Sobre nós',
      contact: 'Contacto', gallery: 'Galeria', imprint: 'Aviso legal', privacy: 'Privacidade',
    },
  },
};

export function getSeoCopy(lang) {
  return SEO_COPY[lang] || SEO_COPY.de;
}
