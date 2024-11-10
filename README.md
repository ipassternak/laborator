# Laborator

Laborator is a simple Node.js project built on the [Fastify](https://github.com/fastify) framework, designed to create scalable, secure, and reliable applications while ensuring a smooth developer experience.

## Variant of an additional laboratory task

1 variant

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/en) (only for development): v22 or later
- [Docker](https://www.docker.com/): Ensure you have Docker installed on your system.
- Unix Shell: A Unix-like shell is required for running scripts.

### Cloning the Repository
To clone the repository, run the following commands in your terminal:

```bash
git clone https://github.com/ipassternak/laborator.git
cd laborator
```
### Setting Up the Development Environment

To initialize the development environment, execute the following script:

```bash
compose/dev/init.sh
```

### Starting the Local Project

You can run the project locally using either Docker or directly with Node.js.

**Option 1: Using Docker**

With Docker, you don’t need to have Node.js installed on your system. Docker Compose will install all required dependencies and set up the project for you. However, if you wish to contribute to the project, it's recommended to use the latest version of Node.js.

```bash
docker-compose -f path/to/compose/dev/Dockerfile up -d
```

**Option 2: Using Node.js**

The project supports hot reloading out of the box. Start the development process, and any changes you make will immediately reflect in the running project:

```bash
npm i        # -- install all required dependencies
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE)
