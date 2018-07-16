var express = require('express');
var app = express();
var request = require('request');
var rp = require('request-promise');
const axios = require('axios');

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
    //items.searchQuery = req.query.q;
    //items.getResultados();
    var jsonfiltrado = {
        "author":{
            "name": "Alexis",
            "lastname": "Boggan"
        },
        "categories":[],
        "items":[]
    };    

    axios.get(requestUrl+req.query.q)
    .then(function (response) {
        // handle success
        //var json = JSON.parse(response.data);

        var item = {};
    
        for (var i=0 ; i<4 ; i++){
            var resultado = response.data.results[i];
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

        var resultado = response.data.results[0]
        
       

        axios.get("https://api.mercadolibre.com/categories/"+resultado.category_id)
        .then(function (response) {
            // handle success
            //var json = JSON.parse(response.data);
            //var resultado = response.data.results[0]
            

            var categorias = response.data.path_from_root;

            for(var i=0 ; i < categorias.length; i++ ){
                jsonfiltrado.categories.push(categorias[i].name);
            }
            //console.log(categories);       
            //jsonfiltrado.categories = categories;  
            

            res.send({ jsonfiltrado });

            

            //console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

        //console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });

  
});


app.listen(3000); //listens on port 3000 -> http://localhost:3000/