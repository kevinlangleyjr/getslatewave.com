import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const themes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/themes' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      shortName: z.string(),
      slug: z.string(),
      category: z.enum(['editor', 'terminal', 'notes', 'browser', 'chat', 'other']),
      tagline: z.string().max(140),
      summary: z.string().max(320),
      status: z.enum(['stable', 'beta', 'planned']).default('stable'),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      accent: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      repo: z.object({
        owner: z.string(),
        name: z.string(),
        url: z.string().url(),
        defaultBranch: z.string().default('main'),
      }),
      links: z
        .object({
          marketplace: z.string().url().optional(),
          issues: z.string().url().optional(),
          releases: z.string().url().optional(),
          download: z.string().url().optional(),
        })
        .default({}),
      hero: z
        .object({
          image: image(),
          alt: z.string(),
        })
        .optional(),
      gallery: z
        .array(
          z.object({
            image: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      preview: z.discriminatedUnion('kind', [
        z.object({
          kind: z.literal('code'),
          language: z.string(),
          sample: z.string(),
        }),
        z.object({
          kind: z.literal('terminal'),
          prompt: z.string(),
          lines: z.array(z.string()),
        }),
        z.object({
          kind: z.literal('image'),
          image: image(),
          alt: z.string(),
        }),
      ]),
      install: z
        .array(
          z.object({
            label: z.string(),
            description: z.string().optional(),
            command: z.string().optional(),
            steps: z.array(z.string()).optional(),
            link: z.string().url().optional(),
          }),
        )
        .min(1),
      tags: z.array(z.string()).default([]),
      related: z.array(reference('themes')).default([]),
    }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { themes, docs };
