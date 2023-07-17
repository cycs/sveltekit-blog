import { client } from '../lib/graphql-client';
import {
  authorsQuery,
  siteMetadataQuery,
  socialsQuery,
} from '../lib/graphql-queries';
import { writable } from 'svelte/store';
import type { Author, ProjectMetadataType } from '$lib/graphql/types';

export const socialsStore = writable([]);
export const authorsStore = writable({} as Author);
export const siteMetadataStore = writable({} as ProjectMetadataType);

export const fetchSocials = async () => {
  const { socials } = await client.request(socialsQuery);
  return socialsStore.set(socials[0]);
};

export const fetchAuthors = async () => {
  const { authors } = await client.request(authorsQuery);
  return authorsStore.set(authors[0]);
};

export const fetchSiteMetadata = async () => {
  const { projectMetadatas } = await client.request(siteMetadataQuery);
  return siteMetadataStore.set(projectMetadatas[0]);
};
