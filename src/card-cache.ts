import cache from './cache.json';

export interface Set {
  id: string;
  name: string;
  ptcgoCode?: string;
  releaseDate: string;
}

export interface Card {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  set: Set;
}

export interface Cache {
  cards: Record<string, Record<string, Card>>;
  sets: Set[];
}

export default cache as Cache;
