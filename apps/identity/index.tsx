type Participant = {
  id: string;
  name?: string;
  avatarUrl?: string;
  mission?: string;
  services: ParticipantService[];
  needs: ParticipantNeed[];
  networks: {
    email?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    reddit?: string;
  };
};

type ParticipantService = {
  label: string;
  capacity: string;
};

type ParticipantNeed = {
  label: string;
  link: string;
};
