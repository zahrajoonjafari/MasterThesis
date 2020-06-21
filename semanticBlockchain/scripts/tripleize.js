
const fs = require('fs');
const parse = require('csv-parse');
const readline = require('readline');
const Handlebars = require('handlebars');
const Stream = require('stream');

fs.readFile('../templates/transactions.tmp', 'utf8', function (err,data) {
    if (err) {
        throw new Error(err);
    } else {
        rendering(data);
    }

});

function rendering(source) {
    const template = Handlebars.compile(source);
    const readStream = fs.createReadStream('../data/input/transactions.csv');
    //const writeStream = fs.createWriteStream( "../data/output/blocks.ttl", { encoding: "utf8"} );
    let rl = readline.createInterface({
        input: readStream,
        output: new Stream,
        terminal: false,
        historySize: 0
    });

    rl.on('line', function(line) {
        // process line here
        parse(line, (err, data) => {
           if(err) {
              console.log("Error: " + err);
              throw new Error(err);
            } else {
               tripleize(data, template);
             // writeStream.write(line);  
            }      
        });
      
    }).on ('close', function() {
        console.log('Good done!');
        process.exit(0);
      });

}

function tripleize (data, template){

    let properties ={
        tx_hash: data[0][0],
        tx_block_number: data[0][1],
        tx_block_header: data[0][2],
        tx_block_timestamp: data[0][3],
        tx_from: data[0][4],
        tx_to: data[0][5],
        tx_address: data[0][6],
        tx_gas_price: data[0][7],
        tx_gas_used: data[0][8],
        tx_value: data[0][9],
    };

    var result = template(properties);
    var header = fs.readFileSync('../data/input/headers.ttl', 'utf8');
    //console.log(header)
   // fs.writeFileSync('../data/output/output.ttl', header  +"\r\n");
    fs.appendFileSync('../data/output/output.ttl', result  +"\r\n");  
    
}

    




