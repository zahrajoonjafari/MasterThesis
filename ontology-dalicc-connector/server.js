const express = require('express');
const fs =  require('fs');
const cors = require('cors');
const shell = require('shelljs');
const app = express();
let output = '';
let allValues = [];
let lastOut = [];
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.post('/', function (req, res) {
  
 let content = req.body.toString();

   fs.appendFileSync('src/semantic_mapping/headers.ttl', content, err => {

      if(err) {

         console.log(err);
      }
    })
})
 
function devider(array, cols) {
    
   function split(array, cols) {
       if (cols==1) return array;
       var size = Math.ceil(array.length / cols);
       return array.slice(0, size).concat([null]).concat(split(array.slice(size), cols-1));
   }

   var a = split(array, cols);
   var groups = [];
   var group = [];
   for(var i = 0; i < a.length; i++) {
       if (a[i] === null) {
           groups.push(group);
           group = [];
           continue;
        }
       group.push(a[i]);
       
   }
   groups.push(group);
   return groups;

}

function getSparqleResult() {
   output = shell.exec('sh sparql.sh').stderr;
   let postOut = output.replaceAll('-', '').replaceAll('"', '').replaceAll('|' ,  '').replaceAll('=', '')
                .replaceAll('^^xsd:int.maxInclusivehexBinary', '').replaceAll('^^xsd:int.maxInclusivedateTime', '')
                .replaceAll('bi:', '').replaceAll('txi:', '').trimStart();
   
   let postOutArray = postOut.split('  ');
   let lastArray = postOutArray.filter(fi => fi !== '' && fi !== '\n');
   let keys = lastArray.slice(0, 19);
   let restArray = lastArray.slice(19, lastArray.length)
   let middleIndex = Math.ceil(restArray.length / 19);
   let dividedArray = devider(restArray, middleIndex);
   
   for (let section of dividedArray) {
     
      allValues = Object.assign({}, ...keys.map((e, i) => ({ [e]: section[i]})));
      lastOut.push(allValues)
   
   }

   return lastOut;
}
 

app.use('/', async function(req, res) {
   let sparqlResponse = getSparqleResult();
   res.setHeader('content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
   res.send(sparqlResponse);  
   res.end(); 
})


app.listen(5000, () => console.log('Server is listening on port 5000...'));
