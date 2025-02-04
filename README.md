# News Child App Microfrontend

This repository contains the **News Child App**, designed as a microfrontend in a larger application architecture. It is built using **React**, **Tailwind CSS**, and the **Module Federation Plugin** for Webpack, and configured with **CRACO** for custom configuration.

## Features
- Developed as a microfrontend for seamless integration with a parent application.
- Built with modern technologies like React and Tailwind CSS.
- Module Federation for dynamic sharing of code between apps.
- Responsive and optimized for performance.

## Tech Stack
- **React**: Frontend library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **CRACO (Create React App Configuration Override)**: For extending CRA configuration.
- **Webpack Module Federation**: For microfrontend architecture.

## Project Setup

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rk4rohankumar/news-child-app.git
   cd news-child-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. create a `.env` file in the root directory and add the following line:
   ```bash
   REACT_APP_NEWS_API_KEY=YOUR_NEWS_API_KEY
   ```
   Replace `YOUR_NEWS_API_KEY` with your own API key from [NewsAPI](https://newsapi.org/).

### Running the Application
To start the development server:
```bash
npm start
# or
yarn start
```
The app will be accessible at [http://localhost:3000](http://localhost:3000).

### Building for Production
To create a production build:
```bash
npm run build
# or
yarn build
```

### Configuration Details
#### CRACO and Webpack
The project uses **CRACO** to customize the Webpack configuration for supporting Module Federation:
- **publicPath**: Set to `https://news-child-app.vercel.app/` for deployment.
- **Module Federation Plugin**:
  - Name: `NewsApp`
  - Remote Entry: `remoteEntry.js`
  - Exposes: `./NewsApp` from `./src/App`
  - Shared Dependencies: `react`, `react-dom`, and `tailwindcss`

### Deployment
The app is deployed at: [https://news-child-app.vercel.app/](https://news-child-app.vercel.app/)

## Microfrontend Integration
To consume this microfrontend in a parent application, include the following in your Module Federation configuration:
```javascript
new ModuleFederationPlugin({
  remotes: {
    NewsApp: 'NewsApp@https://news-child-app.vercel.app/remoteEntry.js',
  },
})
```

## Scripts
- `start`: Starts the development server.
- `build`: Builds the app for production.
- `test`: Runs tests.
- `eject`: Ejects the CRA configuration.

## Folder Structure
```
news-child-app/
├── src/
│   ├── components/   # Reusable components
│   ├── App.js         # Main App component
│   └── index.js       # Entry point
├── public/            # Static files
├── craco.config.js    # Custom configuration for Webpack
└── package.json       # Project metadata and dependencies
```

## Contribution Guidelines
Feel free to fork the repository and submit pull requests for any enhancements or bug fixes.

## License
This project is licensed under the [MIT License](LICENSE).

