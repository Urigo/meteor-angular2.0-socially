export interface Party {
  _id?: string;
  name: string;
  description?: string;
  location: Location;
  owner?: string;
  public: boolean;
  invited?: string[];
  rsvps?: RSVP[];
  images?: string[];
}

interface RSVP {
  userId: string;
  response: string;
}

interface Location {
  name: string;
  lat?: number;
  lng?: number;
}
