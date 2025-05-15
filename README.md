# 🎲 BetGame Frontend

This project is the **frontend for the decentralized betting game** integrated with the [BetGame smart contract](https://github.com/JakeB-5/betgame).  
Built with **Vue 3** and **TypeScript**, it allows users to connect their wallets, place bets, and receive rewards based on the game outcome.


## 🔗 Related Project

- 💻 [BetGame Smart Contract (RUST)](https://github.com/JakeB-5/betgame)  
  Core game logic, reward distribution, and betting mechanics are implemented in this smart contract.


---

## 🚀 Features

- 🦊 Web3 wallet integration (Phantom)
- 🎮 Place bets and view game results
- 🔐 Real-time interaction with smart contracts via `web3.js`
- ⚙️ Global state management using vuex
- 🧠 Clean, modular component architecture with strong typing
- 📈 UX optimized through feedback from actual users

---

## 🛠 Tech Stack
| Tech          | Description                                |
|---------------|--------------------------------------------|
| Vue 3         | SPA framework with Composition API         |
| TypeScript    | Type safety and better maintainability     |
| Vuex          | State management                           |
| web3.js       | Blockchain and wallet interaction          |

## 📁 Project Structure
betgame-frontend/
├── src/
│   ├── components/    # UI and game-related components
│   ├── stores/        # Pinia stores
│   ├── views/         # Main views/pages
│   ├── router/        # Route definitions
│   └── main.ts        # App entry point
├── public/
├── scripts/           # CLI scripts for game management

# Clone the repository
git clone https://github.com/JakeB-5/betgame-frontend.git
cd betgame-frontend

# Install dependencies
yarn install

# Run the development server
yarn serve

# Run the game management process
ts-node ./cli/cli.ts
