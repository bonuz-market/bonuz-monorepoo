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
  description: string;
  image: {
    url: string;
  };
  agenda: string;
  startDate: Date;
  endDate: Date;
  type: string;
  checkIns: CheckIn[];
  quests: Quest[];
}
