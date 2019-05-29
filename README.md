[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

[Express'](https://www.npmjs.com/package/express) application generator.

## Installation


## Quick Start

Based on [express-generator'](https://github.com/expressjs/generator). , this is a complete "basic" app generator.

Create a basic app with mongoose and no Cluster and no socket IO:

```bash
$ ran --mgnc "app name"
```

Install dependencies:

```bash
$ npm install
```

Start your Express.js app at `http://localhost:5000/`:

```bash
$ npm start
```

## Command Line Options

This generator can also be further configured with the following command line flags.

        Usage: express [options] [dir]

        Options:
              --version           output the version number
          -s, --stack <Stack id>  express mongoose no cluster
              --mgnc              express mongoose no cluster
              --mgwc              express mongoose with cluster
              --msnc              express mySQL no cluster
              --mswc              express mySQL with cluster
          -io, --socket <id>      add or not socket io to project
               --io,              add socket io to project
          -h, --help              output usage information


