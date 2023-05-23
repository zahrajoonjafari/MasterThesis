# Comunica SPARQL HDT Init Actor

[![Build Status](https://travis-ci.org/comunica/comunica-actor-init-sparql-hdt.svg?branch=master)](https://travis-ci.org/comunica/comunica-actor-init-sparql-hdt)
[![npm version](https://badge.fury.io/js/%40comunica%2Factor-init-sparql-hdt.svg)](https://www.npmjs.com/package/@comunica/actor-init-sparql-hdt)

A comunica SPARQL [HDT](http://www.rdfhdt.org/) Init Actor.

This module is part of the [Comunica framework](https://comunica.dev/).

[Click here to learn more about querying HDT files with Comunica](https://comunica.dev/docs/query/advanced/hdt/).

## Install

HDT requires GCC 4.9 or higher to be available.

```bash
$ yarn global add @comunica/actor-init-sparql-hdt
```

or

```bash
$ npm install -g @comunica/actor-init-sparql-hdt
```

## Usage from the command line

Show 100 triples from a HDT file:

```bash
$ comunica-sparql-hdt hdtFile@myfile.hdt "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

Show the help with all options:

```bash
$ comunica-sparql-hdt --help
```

Just like [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql),
a [dynamic variant](https://github.com/comunica/comunica/tree/master/packages/actor-init-sparql#usage-from-the-command-line) (`comunica-dynamic-sparql-hdt`) also exists.

_[**Read more** about querying from the command line](https://comunica.dev/docs/query/getting_started/query_cli_file/)._

### Usage within application

This engine can be used in JavaScript/TypeScript applications as follows:

```javascript
const newEngine = require('@comunica/actor-init-sparql-hdt').newEngine;
const myEngine = newEngine();

const result = await myEngine.query(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: ['http://fragments.dbpedia.org/2015/en'],
});

// Consume results as a stream (best performance)
result.bindingsStream.on('data', (binding) => {
    console.log(binding.get('?s').value);
    console.log(binding.get('?s').termType);

    console.log(binding.get('?p').value);

    console.log(binding.get('?o').value);
});

// Consume results as an array (easier)
const bindings = await result.bindings();
console.log(bindings[0].get('?s').value);
console.log(bindings[0].get('?s').termType);
```

_[**Read more** about querying an application](https://comunica.dev/docs/query/getting_started/query_app/)._

### Usage as a SPARQL endpoint

Start a webservice exposing http://fragments.dbpedia.org/2015-10/en via the SPARQL protocol, i.e., a _SPARQL endpoint_.

```bash
$ comunica-sparql-hdt-http hdtFile@/path/to/my/file.hdt
```

Show the help with all options:

```bash
$ comunica-sparql-hdt-http --help
```

The SPARQL endpoint can only be started dynamically.
An alternative config file can be passed via the `COMUNICA_CONFIG` environment variable.

Use `bin/http.js` when running in the GitHub repo.

_[**Read more** about setting up a SPARQL endpoint](https://comunica.dev/docs/query/getting_started/setup_endpoint/)._
