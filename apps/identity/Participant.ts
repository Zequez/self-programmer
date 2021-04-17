export type Participant = {
  id: string;
  name?: string;
  avatarUrl?: string;
  mission?: string;
  services: Service[];

  energy: Energy[];
  assets: Asset[];
  apps: App[];
  protocols: ParticipantProtocol[];
  spaces: Space[];

  gratitude: Note[];
  asking: Note[];
  seeking: Note[];
  updates: Note[];
  giving: Note[];
  receiving: Note[];
  goals: Note[];
};

type App = {
  id: string;
  roles: { [key: string]: Participant };
  source: string;
};

type Space = {
  name: string;
  position: LatLng[];
};

type LatLng = {
  lat: number;
  lng: number;
};

type Note = {
  shareWith: string[];
  message: string;
};

type ParticipantProtocol = {
  protocol: Protocol;
  identity: string;
};

enum Protocol {
  ProtocolIdentity = "identity",
  ProtocolMatrix = "matrix",
  ProtocolWeb = "web",
  ProtocolEmail = "email",
  ProtocolFacebook = "facebook",
  ProtocolInstagram = "instagram",
  ProtocolYouTube = "youtube",
  ProtocolReddit = "reddit",
  ProtocolPhone = "phone",
  ProtocolWhatsapp = "whatsapp",
  ProtocolGoodDollar = "gooddollar",
  ProtocolBitcoin = "bitcoin",
  ProcotolPaystring = "paystring",
  ProtocolCbu = "cbu",
}

type Energy = {
  source: string;
  amount: number;
};

type Asset = {
  name: string;
  availability: string;
};

type Service = {
  label: string;
  capacity: string;
};
