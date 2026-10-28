/** Showcase data — concept projects (NOT verified client campaigns).
 *
 * To use your own imagery, drop files into `public/images/` and point the
 * `image` field at them, e.g. image: 'my-project.jpg'.
 * When `image` is null an elegant procedural placeholder is rendered.
 *
 * Paths are resolved through Vite's BASE_URL so they work both locally and
 * when the site is hosted under a sub-path (e.g. GitHub Pages).
 */
const asset = (file) => `${import.meta.env.BASE_URL}images/${file}`;

export const showcaseFilters = ['All', 'Hospitality', 'Culinary', 'Fitness'];

export const projects = [
  {
    id: 'obsidian-valley',
    name: 'Obsidian Valley Resort',
    handle: '@obsidian.resort',
    type: 'Luxury Stay Campaign',
    focus: 'Architecture & Mood',
    metric: '184K views',
    metricLabel: 'Concept showcase',
    category: 'Hospitality',
    image: asset('project-obsidian.svg'),
  },
  {
    id: 'aura-gastronomy',
    name: 'Aura Gastronomy',
    handle: '@aura.dining',
    type: 'Fine Dining Curation',
    focus: 'Texture & Lighting',
    metric: '142K views',
    metricLabel: 'Concept showcase',
    category: 'Culinary',
    image: asset('project-aura.svg'),
  },
  {
    id: 'kinetix-athletic',
    name: 'KINETIX Athletic',
    handle: '@kinetix.fit',
    type: 'High-Energy Campaign',
    focus: 'Motion & Intensity',
    metric: '380K reach',
    metricLabel: 'Concept showcase',
    category: 'Fitness',
    image: asset('project-kinetix.svg'),
  },
];
