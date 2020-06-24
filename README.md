# Semantic Blockchain:
 ### Node.js v9.5.0 (should work with current version from https://nodejs.org/en/)
 ### Apache Jena 3.7.0 ARQ

## Usage

To produce triple using EthOn ontology for transactions:
 - cd scripts
 - node tripleize.js
 - cd ..
 - cd models
 - arq --data=../data/output/output.ttl   --query=types.rq 
 
