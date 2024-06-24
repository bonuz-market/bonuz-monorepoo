interface Quest {
  id: number;
  title: string;
  description: string;
  image: {
    url: string;
  };
  isPending: boolean;
  // JSON object
  verification: string;
}

interface CheckIn {
  userId: number;
  date: Date;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  shortDescription: string;
  image: {
    url: string;
  };
  link: string;
  start_date: string;
  end_date: string;
  organizer: string;
  agenda?: string;
  challenges: {
    id: number;
    name: string;
    description: string;
    image: {
      url: string;
    };
    trackable: number;
    updatedAt: string;
    createdAt: string;
  }[];
  challenges_new: {
    id: number;
    name: string;
    description: string;
    image: {
      url: string;
    };
    trackable: number;
    updatedAt: string;
    createdAt: string;
  }[];
}
