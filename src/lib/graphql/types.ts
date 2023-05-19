export type ProjectMetadataType = {
  name: string;
  siteUrl: string;
  description: string;
  openGraphDefaultImage: {
    url: string;
  };
};

export type Author = {
  name: string;
  intro: string;
  bio: string;
  slug: string;
  picture: {
    url: string;
  };
};
