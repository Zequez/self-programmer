import { Participant } from "../Participant.ts";

type KeyOfParticipant = keyof Participant;
export type Query = KeyOfParticipant[];
export type ParticipantInfo = Partial<Participant>;

export function receive(
  query: Query,
  onReceive: (participants: ParticipantInfo[]) => void,
  onError: (status: number) => void
): void {
  setTimeout(async () => {
    const response = await fetch(`/query?labels=${query.join("&")}`);
    if (response.status === 200) {
      onReceive((await response.json()) as ParticipantInfo[]);
    } else {
      console.error(`Error while querying the app ${response.status}`);
      onError(response.status);
    }
  });
}

export async function release(
  participant: ParticipantInfo,
  was?: ParticipantInfo
): Promise<boolean> {
  const response = await fetch("/release", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      participant: participant,
      was: was || null,
    }),
  });
  if (response.status === 200) {
    console.log("Participant information was updated successfully");
    return true;
  } else if (response.status === 201) {
    console.log("A new participant was created as a result of this");
    return true;
  } else if (response.status === 401) {
    console.error("You aren't identified as this person");
    return false;
  } else if (response.status === 400) {
    console.error("Invalid user parameters");
    return false;
  } else if (response.status === 409) {
    console.error(
      "The information you wanted to modify changed while you were editing"
    );
    return false;
  } else {
    console.log("Unknown error", response.status);
    return false;
  }
}
