export type Participant = {
  id: string;
  name?: string;
  avatarUrl?: string;
  mission?: string;
  services: Service[];
  needs: Need[];
  energy: Energy[];
  assets: Asset[];
  apps: App[];
  protocols: ParticipantProtocol[];
  gratitude: Note[];
  asking: Note[];
  whereabouts: Home[];
};

type App = {
  id: string;
  admin: Participant;
};

type Home = {
  name: string;
  lat: number;
  lng: number;
};

type Note = {
  to: string;
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

type Need = {
  label: string;
  link: string;
};
