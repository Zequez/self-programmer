type Participant = {
  id: string;
};

type ParticipantId = string;

type ProjectionId = string;

// type AppProjection = {
//   app: App;
//   participants: {[key: string]: Participant};
//   params: {};

//   project: (branch: Branch) => {

//   }
// }

type Projection = {
  id: string;
  from: Branch;
  to: Branch;
  // params: Record<string, Record<string, unknown>>;
  // participants: Record<ParticipantId, Participant>;
};

class AppDriver {
  projections: Record<ProjectionId, Projection> = {};

  watch() {
  }

  get(path: string) {
  }

  params() {
  }

  data() {
  }
}
