interface Party {
  _id?: string;
  name: string;
  description?: string;
  location: string;
  owner?: string;
  public: boolean;
  invited?: Array<string>;
  rsvps?: Array<RSVP>;
}

interface RSVP {
  userId: string;
  response: string;
}