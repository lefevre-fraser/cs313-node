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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

