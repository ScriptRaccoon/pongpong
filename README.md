# PongPong Game

This is a basic browser game with a leaderboard. The latter is stored in a database on [turso](https://turso.tech/). It is mainly an illustration of using turso within SvelteKit.

**Notice.** Currently, there is no protection against cheating.

<img  width="500" alt="pongpong-screenshot" src="https://github.com/user-attachments/assets/0026e872-8a80-4dc9-9013-eecb0e53286d" />

## Gameplay

1. There are two paddles (white) that can be controlled with the Arrow Keys `Up` / `Down`. Which paddle is active depends on the current direction of the ball.
2. The ball (yellow) bounces off the walls top/down and the paddles, but not the walls on the left/right. In that case, it is game over.
3. Each hit of the ball increments the score.
4. Regularly, _deviators_ are added. These are blue cells that change the direction of the ball according to an specified angle (which is different for every deviator) once it crosses them. Each time that happens, the deviator grows.
5. Regularly, _accelerators_ are added. These are small red cells that accelerate the ball once it crosses them. When this happens, the accelerator will be removed.
6. The best 5 scores are recorded in the leaderboard.

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
