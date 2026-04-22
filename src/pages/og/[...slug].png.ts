import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng, type OgInput } from '~/lib/og';

interface RouteProps {
  input: OgInput;
}

const CATEGORY_LABEL: Record<string, string> = {
  editor: 'Editor theme',
  terminal: 'Terminal theme',
  notes: 'Notes theme',
  browser: 'Browser theme',
  chat: 'Chat theme',
  other: 'Theme',
};

export const getStaticPaths: GetStaticPaths = async () => {
  const [themes, docs] = await Promise.all([
    getCollection('themes', ({ data }) => data.status !== 'planned'),
    getCollection('docs', ({ data }) => !data.draft),
  ]);

  const themeRoutes = themes.map((theme) => ({
    params: { slug: `themes/${theme.data.slug}` },
    props: {
      input: {
        eyebrow: CATEGORY_LABEL[theme.data.category] ?? 'Theme',
        title: theme.data.name,
        description: theme.data.summary,
        accent: theme.data.accent,
        footer: `slatewave.dev/themes/${theme.data.slug}`,
      },
    } satisfies RouteProps,
  }));

  const docRoutes = docs.map((doc) => ({
    params: { slug: `docs/${doc.id}` },
    props: {
      input: {
        eyebrow: 'Docs',
        title: doc.data.title,
        description: doc.data.description,
        footer: `slatewave.dev/docs/${doc.id}`,
      },
    } satisfies RouteProps,
  }));

  const staticRoutes: { params: { slug: string }; props: RouteProps }[] = [
    {
      params: { slug: 'default' },
      props: {
        input: {
          eyebrow: 'A cohesive theme system',
          title: 'One palette. Every tool.',
          description:
            'Slatewave is a family of themes that share a single, carefully-tuned color system — editor, terminal, and notes speaking the same visual language.',
        },
      },
    },
    {
      params: { slug: 'themes' },
      props: {
        input: {
          eyebrow: 'Themes',
          title: 'Every surface, one palette.',
          description:
            'Every Slatewave theme is generated from the same palette, tuned for the surface it runs on.',
          footer: 'slatewave.dev/themes',
        },
      },
    },
    {
      params: { slug: 'colors' },
      props: {
        input: {
          eyebrow: 'Palette',
          title: 'The Slatewave palette.',
          description:
            'A slate foundation with a teal signature and sky, rose, purple, and amber accents.',
          footer: 'slatewave.dev/colors',
        },
      },
    },
    {
      params: { slug: 'docs' },
      props: {
        input: {
          eyebrow: 'Docs',
          title: 'Design the palette, document the rest.',
          description:
            'Reference material for the Slatewave color system — the palette, its principles, and how to contribute.',
          footer: 'slatewave.dev/docs',
        },
      },
    },
    {
      params: { slug: 'changelog' },
      props: {
        input: {
          eyebrow: 'Changelog',
          title: 'Every release, everywhere.',
          description:
            'A combined feed of releases across every Slatewave theme.',
          footer: 'slatewave.dev/changelog',
          accent: '#38bdf8',
        },
      },
    },
    {
      params: { slug: 'playground' },
      props: {
        input: {
          eyebrow: 'Playground',
          title: 'Try the theme, live.',
          description:
            'A real Monaco editor loaded with the exact Slatewave TextMate theme — paste your own code and see how it feels.',
          footer: 'slatewave.dev/playground',
          accent: '#b388ff',
        },
      },
    },
  ];

  return [...staticRoutes, ...themeRoutes, ...docRoutes];
};

export const GET: APIRoute = async ({ props }) => {
  const { input } = props as RouteProps;
  const png = await renderOgPng(input);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
