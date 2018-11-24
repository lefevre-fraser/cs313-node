const express = require('express')
const path = require('path')
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/AssetTracker', async (req, res) => {
    res.sendFile(path.join(__dirname, '/views/pages/AssetTracker/assets.html'))
  })
  .get('/AssetTracker/UserAccount', async (req, res) => {
    res.sendFile('pages/AssetTracker/user.html')
  })
  .get('/AssetTracker/LoginServices', async (req, res) => {
    res.sendFile('pages/AssetTracker/login.html')
  })
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
  .get('/Teach10/PersonData', async (req, res) => {
    var id = req.query.id
    try {
      const client = await pool.connect()
      var query = "select" 
      query +=    " case when c.person_id = $1 then c.fname || ' ' || c.lname"
      query +=    " when m.person_id = $1 then m.fname || ' ' || m.lname"
      query +=    " when f.person_id = $1 then f.fname || ' ' || f.lname"
      query +=    " end as person_name,"
      query +=    " case when f.person_id = $1 then 'PERSON'"
      query +=    " else f.fname || ' ' || f.lname"
      query +=    " end as father_name,"
      query +=    " case when m.person_id = $1 then 'PERSON'"
      query +=    " else m.fname || ' ' || m.lname"
      query +=    " end as mother_name,"
      query +=    " case when c.person_id = $1 then 'PERSON'"
      query +=    " else c.fname || ' ' || c.lname"
      query +=    " end as child_name"
      query +=    " from "
      query +=    " parent_child pc"
      query +=    " inner join "
      query +=    " person c"
      query +=    " on c.person_id = pc.child_id"
      query +=    " inner join"
      query +=    " person f"
      query +=    " on f.person_id = pc.father_id"
      query +=    " inner join"
      query +=    " person m"
      query +=    " on m.person_id = pc.mother_id"
      query +=    " where pc.father_id = $1"
      query +=    " or pc.mother_id = $1"
      query +=    " or pc.child_id = $1"
      const result = await client.query(query, [id])
      const results = { 'results': (result) ? result.rows : null }
      res.render('../public/Teach10/Teach10.ejs', results)
      client.release()
    } catch (err) {
      console.error(err)
      res.send("ERROR: " + err)
    }
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