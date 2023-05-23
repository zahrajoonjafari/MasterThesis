#!/bin/bash

. /etc/environment
 SPARQL=`sparql   --data=src/semantic_mapping/headers.ttl --query=src/semantic_mapping/query/types.rq`


 echo $SPARQL >&2
