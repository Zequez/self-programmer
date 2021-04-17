# Identity

The identity app is the base app of the whole self-programmer. You can create apps
that don't need identity information; but the self-programmer itself depends on the
app for it's internal workings.

The app defines a `Participant` structure shape that has general information about a person
that uses the self-programmer.

Participants can see all other participants data; apps can use this to create games
and information. Imagine a board game where all the information is available to every player.

Identity it's the core of the agent-centric architecture.

Apps extend the `Participant` class, and can add extra data and actions.

With this relatively simple architecture there is an universe of fantastic
apps that can be easily created.

While right now the data is stored on the disk, it doesn't have to be this way; the participants
information storage could easily be something like Holochain.
