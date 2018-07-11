var express = require('express');
var app = express();
var request = require('request');

app.use(express.static(__dirname +'./../../')); //serves the index.html

app.get('/api/item/:id', (req, res) => {
    //res.send({ express: 'Hello From Express' + req.params.id });

    var requestUrl = "https://api.mercadolibre.com/items/"; 
    console.log(req.params.id);
  
    request(requestUrl + req.params.id + "/description", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            //console.log(json); 
           
            res.send({ express: json });
        } else {
            console.log("There was an error: ") + response.statusCode;
            console.log(body);
            res.send({ express: 'Hello From Express not ok' });   // send some response here
        }
    });
 

  });

app.get('/api/items', function(req, res, next) {
   
    var requestUrl = "https://api.mercadolibre.com/sites/MLA/search?q="; 
    
    request(requestUrl + req.query.q, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            //console.log(json); 
            
        var jsonfiltrado = {
            "author":{
                "name": "Alexis",
                "lastname": "Boggan"
            },
            "categories":[],
            "items":[]
        };

        var item = {};
        
        for (var i=0 ; i<4 ; i++){
            var resultado = json.results[i];
            item = {
                "id" : resultado.id,
                "title": resultado.title,
                "price": {
                    "currency": resultado.currency_id,
                    "amount": resultado.price,
                    "decimals": 0
                },
                "picture": resultado.thumbnail,
                "condition": resultado.condition,
                "free_shipping": resultado.shipping.free_shipping
            }
            jsonfiltrado.items.push(item);                
        }
            //getCategories(json.results[0].category_id);

            /*var requestUrlCategories = "https://api.mercadolibre.com/categories/";
            var categories = [];
            request(requestUrlCategories + json.results[0].category_id), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(body);
                    for(var i=0 ; i < json.path_from_root.length; i++ ){
                        jsonfiltrado.categories.push(json.path_from_root[i].name);
                    }
                    console.log(categories);       
                    //jsonfiltrado.categories = categories;    
                }
            };*/

            res.send({ express: jsonfiltrado });
        } else {
            console.log("There was an error: ") + response.statusCode;
            console.log(body);
            res.send({ express: 'Hello From Express not ok' });   // send some response here
        }
    });
});

app.listen(3000); //listens on port 3000 -> http://localhost:3000/