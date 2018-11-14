const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/math', function (req, res) { 
  		res.render('text/html');
  		console.log(req.query.op1);
  		console.log(req.query.op2)
  		res.end();
  	})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

