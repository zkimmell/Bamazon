var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
  host     : 'bamazon',
  user     : 'root',
  password : 'root',
  database : 'products'
});
 
connection.connect()
start();


var start = function(){
	connection.query("SELECT * FROM products", function(err, res){
		console.log(res);
		inquirer.prompt({
		name: "choice",
		type: "rawlist",
		choices: function(value){
			var choiceArray = [];
			for (var i=0; i < res.length; i++){
			  choiceArray.push(res[i].product_name);
			 }
			 return choiceArray;
			},
		message:"What item would you like to buy?"
		}).then(function(answer){
			for (var i=0; i < res.length; i++){
				if (res[i].product_name === answer.choice){
					var chosenItem = res[i];
					inquirer.promp({
					  name: "quantity",
					  type: "input",
					  message: "How many would you like to buy?"
					}).then(function(answer){
						if(chosenItem.stock_quantity > parseInt(answer.quantity)){
							connection.query("UPDATE products SET ? WHERE ?", [{
							 stock_quanitity:chosenItem.stock_quantity - parseInt(answer)},
							 {item_id: chosenItem.item_id}
							]);

							console.log("Your total is" + (chosenItem.price * answer.quantity));
						
							}
							})
						}
					}
				})
			})
		}
	}
	


