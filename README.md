# Pokémon TCG Pull Overlay
Pokémon TCG Pull Overlay is an easy-to-use web application for tracking card pulls for the Pokémon TCG. It is built in such a way that it is easy to integrate as part of a Twitch stream using software such as a OBS Studio.

## How to Use
The application is available at https://weedl.es/pulls. At some point in the near future, I will provide a short video tutorial on how to use it.

## Development
### Requirements
- Node.js/npm (https://nodejs.org)
- A Pokémon TCG API key (https://pokemontcg.io)
### Installation & Running
- Run `npm install` in the repository
- Set your `API_KEY` environment to your Pokémon TCG API key
- Run `npm run build-cache` to build the card cache (only required each time a set is released)
- Run `npm start` and the application should open in your browser
### Production Builds
- Run `npm build`
- Production files will be in the `build/` directory

## Contributing
Feel free to open pull requests/issues as necessary.