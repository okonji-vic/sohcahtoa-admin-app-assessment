export type TSideNavProps = {
    title: string;
    icon: React.ReactNode;
    link: string;
    roles: string[];
    type: string;
    key?: string;
    children?: {
      title: string;
      link?: string;
      query?: Record<string, string>;
      basePath?: string | string[];
    }[];
  };