# PongPong Game

This is a basic browser game with a leaderboard. The latter is stored in a database on [turso](https://turso.tech/). It is mainly an illustration of using turso within SvelteKit.

**Notice.** Currently, there is no protection against cheating.

## Setup

Create a database at turso and add the credentials to `.env`. Use `.env.example` as guidance.

Make sure to have [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io/) installed.

Install the dependencies:

`pnpm install`

To start the server, run

`pnpm start`

For development, use

`pnpm dev`

To seed the database, use `pnpm seed`. This creates the leaderboard table.
