const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/math', function (req, res) { 
  		var result;
  		var op1 = req.query.op1;
  		var op2 = req.query.op2;
  		switch (req.query.operand) {
  			case '/':
  				result = op1 / op2;
  				break;
  			case '*':
  				result = op1 * op2;
  				break;
  			case '-':
  				result = op1 - op2;
  				break;
  			case '+':
  				result = op1 + op2;
  				break;
  		}
  		console.log(result);

  		res.render('../public/Teach09/results', { result : result });
  		res.end();
  	})
  .get('/PostalRates/Response', function (req, res) {
    var weight = req.query.weight
    var type   = req.query.type
    var price  = calculateRate(weight, type)
    var variables = { "price" : price }
    res.render('../public/PostalRates/response.ejs', variables)
    res.end()
  })
  .get('/Teach10/PersonData', function (req, res) {
    var id = req.query.id;
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


function calculateRate (weight, type) {
  var price = 0
  switch (type) {
    case '1':
      if (weight <= 1)
        price = 0.50
      else if (weight <= 2)
        price = 0.71
      else if (weight <= 3)
        price = 0.92
      else if (weight <= 3.5)
        price = 1.13
      else
        price = "Package weight is too much for this option"
      break;
    case '2':
      if (weight <= 1)
        price = 0.47
      else if (weight <= 2)
        price = 0.68
      else if (weight <= 3)
        price = 0.89
      else if (weight <= 3.5)
        price = 1.10
      else
        price = "Package weight is too much for this option"
      break;
    case '3':
      if (weight <= 1)
        price = 1.00
      else if (weight <= 2)
        price = 1.21
      else if (weight <= 3)
        price = 1.42
      else if (weight <= 4)
        price = 1.63
      else if (weight <= 5)
        price = 1.84
      else if (weight <= 6)
        price = 2.05
      else if (weight <= 7)
        price = 2.26
      else if (weight <= 8)
        price = 2.47
      else if (weight <= 9)
        price = 2.68
      else if (weight <= 10)
        price = 2.89
      else if (weight <= 11)
        price = 3.10
      else if (weight <= 12)
        price = 3.31
      else if (weight <= 13)
        price = 3.52
      else
        price = "Package weight is too much for this option"
      break;
    case '4':
      if (weight <= 4)
        price = 3.50
      else if (weight <= 8)
        price = 3.75
      else if (weight <= 9)
        price = 4.10
      else if (weight <= 10)
        price = 4.45
      else if (weight <= 11)
        price = 4.80
      else if (weight <= 12)
        price = 5.15
      else if (weight <= 13)
        price = 5.50
      else
        price = "Package weight is too much for this option"
      break;
    default:
      price = "Package Type Not Recognized"
      break;
  }

  return price;
}