# PongPong Game

PongPong is a simple browser-based game with a leaderboard. The leaderboard is stored in a database powered by [turso](https://turso.tech/). This project primarily demonstrates how to integrate turso with SvelteKit.

<https://pongpong-game.netlify.app/>

**Note:** Currently, there are no measures in place to prevent cheating. We trust you ;).

<img width="500" alt="pongpong-screenshot" src="https://github.com/user-attachments/assets/0026e872-8a80-4dc9-9013-eecb0e53286d" />

## Gameplay

1. The game features two paddles (white) that can be controlled using the Arrow Keys (`Up` / `Down`). The active paddle depends on the current direction of the ball.
2. The ball (yellow) bounces off the top and bottom walls as well as the paddles. However, if it hits the left or right walls, the game ends.
3. Each successful hit of the ball increases the score.
4. Periodically, _deviators_ (blue cells) appear. These cells alter the ball's direction by a specific angle (unique to each deviator) when the ball crosses them. Each time this happens, the deviator grows in size.
5. Periodically, _accelerators_ (red cells) appear. These cells increase the ball's speed when the ball crosses them. Once activated, the accelerator is removed.
6. The top 5 scores are recorded on the leaderboard.

## Setup

1. Create a database on turso and add the credentials to a `.env` file. Use `.env.example` as a reference.
2. Ensure you have [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io/) installed.

### Installation

Install the required dependencies:

```bash
pnpm install
```

### Seeding the database

To seed the database and create the leaderboard table, run:

```bash
pnpm seed
```

### Running the Game

To start the server, run:

```bash
pnpm start
```

For development mode, use:

```bash
pnpm dev
```
