export type App = {
  id: number;
  name: string;
  description: string;
  image: {
    url: string;
  };
  logo: {
    url: string;
  };
  link: string;
  type: 'DAPP' | 'APP' | 'WEB';
  category: string;
};

export type Partner = {
  id: number;
  name: string;
  description?: string;
  image: {
    url: string;
  };
  logo: {
    url: string;
  };
  link: string;
};

export type DiscoverItem = App | Partner;
export interface AppView {
  DigitalWorlds: {
    docs: {
      title: string;
      items: App[];
    }[];
  };

  RealWorlds: {
    docs: {
      title: string;
      items: Partner[];
    }[];
  };
}
