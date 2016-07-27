export interface Party {
  _id?: string;
  name: string;
  description?: string;
  location: string;
  owner?: string;
  public: boolean;
  invited?: string[];
  rsvps?: RSVP[];
}

interface RSVP {
  userId: string;
  response: string;
}
