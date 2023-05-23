#!/bin/bash

#FILE='src/semantic_mapping/headers.ttl'

#if [ -s $FILE ]; then 

 # if grep -q ethon:block "$FILE"; then 

      . /etc/environment
      SPARQL=`sparql --data=src/semantic_mapping/headers.ttl --query=src/semantic_mapping/query/types.rq | awk -F '\t' 'NR>1'`
      echo $SPARQL >&2
  
  #  else

   #  echo 'can not find your string....'
   #fi 

#else

 #  echo 'File is empty...'

#fi   

  
 
