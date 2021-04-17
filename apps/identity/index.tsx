/// <reference lib="dom" />

// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from "https://jspm.dev/react@16.13.1";

// @deno-types="https://deno.land/x/types/react-dom/v16.13.1/react-dom.d.ts"
import ReactDOM from "https://jspm.dev/react-dom@16.13.1";

import { receive, release, Query } from './lib/connection.ts';

const QUERY: Query = ["id", "name", "avatarUrl"];

type ParticipantFragment = {
  id?: string;
  name?: string;
  avatarUrl?: string;
};

const App = () => {
  const [participants, setParticipants] = React.useState<ParticipantFragment[]>([]);

  receive(
    QUERY,
    (participants: ParticipantFragment[]) => {
      setParticipants(participants);
    },
    () => {}
  );

  return <div className="bg-red-200 text-gray-900 h-60 w-80 flex items-center justify-center mx-auto mt-20">
    {participants.map((p) => <div>{p.id}</div>)}
  </div>;
};

ReactDOM.render(App, document.getElementById("app"));
