const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 8
const bodyParser = require('body-parser')
const path = require('path')
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})
const PORT = process.env.PORT || 5000

var sess = require('express-session')

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(sess({ secret: 'keyboard cat', cookie: {} }))
  .use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/AssetTracker', async (req, res) => {
    if (typeof req.session.user_name !== 'undefined') {
      res.locals.user_name = req.session.user_name
      res.locals.full_name = req.session.full_name

      res.render('pages/AssetTracker/assets')
    } else {
      req.session.returnPage = '/AssetTracker'
      return res.redirect('/AssetTracker/LoginServices')
    }
  })
  .get('/AssetTracker/AssetList', async (req, res) => {
    try {
      const client = await pool.connect()
      var query = "select a.asset_name, a.asset_id, ua.quantity, ua.asset_value"
      query    += " from user_assets ua inner join assets a"
      query    += " on ua.asset_id = a.asset_id"
      query    += " inner join users u"
      query    += " on u.user_id = ua.user_id"
      query    += " where u.user_name = $1::varchar"
      query    += " and UPPER(a.asset_name) like UPPER($2::varchar)"
      switch (req.query.order_by) {
        case '2':
          query += " order by ua.quantity, a.asset_name, ua.asset_value"
          break;
        case '3':
          query += " order by ua.asset_value, a.asset_name, ua.quantity"
          break;
        case '1':
        default:
          query += " order by a.asset_name, ua.quantity, ua.asset_value"
          break;
      }
      const result = await client.query(query, [req.session.user_name, '%' + req.query.search_context + '%'])
      client.release()
      res.send(result.rows)
    } catch (err) {
      console.error(err)
    }
  })
  .get('/AssetTracker/update', async (req, res) => {
    try {
      const client = await pool.connect()
      var query = "select change_user_asset($1::varchar , $2::integer , $3::bigint , $4::bigint , $5::integer)"
      var user_name = req.session.user_name

      await req.query.assets.forEach(async (element, index) => {
        var uniqueName = element
        var quantity = req.query[uniqueName].quantity
        var new_asset_value = req.query[uniqueName].asset_value
        var asset_id_value = uniqueName.split('-')
        const result = await client.query(query, [user_name, asset_id_value[0], new_asset_value, asset_id_value[1], quantity])
      });

      client.release()
      res.send("0")
    } catch (err) {
      console.error(err)
    }
  })
  .get('/AssetTracker/delete', async (req, res) => {
    try {
      const client = await pool.connect()
      var query = "delete from user_assets"
      query    += " where user_id = (select user_id from users where user_name = $1::varchar)"
      query    += " and asset_id = $2::integer"
      query    += " and asset_value = $3::bigint"
      var user_name = req.session.user_name

      await req.query.assets.forEach( async (element, index) => {
        var uniqueName = element
        var asset_id_value = uniqueName.split('-')

        const result = await client.query(query, [user_name, asset_id_value[0], asset_id_value[1]])
      });

      client.release()
      res.send("0")
    } catch(e) {
      console.log(e);
    }
  })
  .get('/AssetTracker/InsertForm', async (req, res) => {
    if (typeof req.session.user_name !== 'undefined') {
      res.locals.user_name = req.session.user_name
      res.locals.full_name = req.session.full_name
      
      res.render('pages/AssetTracker/insert')
    } else {
      req.session.returnPage = '/AssetTracker/InsertForm'
      return res.redirect('/AssetTracker/LoginServices')
    }
  })
  .get('/AssetTracker/Insert', async (req, res) => {
    try {
      const client = await pool.connect()
      var query = "select insert_asset( $1::varchar , $2::integer , $3::bigint , $4::text )"
      var user_name   = req.session.user_name
      var quantity    = req.query.quantity
      var asset_value = req.query.asset_value
      var asset_name  = req.query.asset_name
      const params = [user_name, quantity, asset_value, asset_name]
      const result = await client.query(query, params)
      client.release()
      res.send("" + result.rows[0].insert_asset)
    } catch (err) {
      console.error(err)
    }
  })
  .get('/AssetTracker/UserAccount', async (req, res) => {
    if (typeof req.session.user_name !== 'undefined') {
      try {
        res.locals.user_name = req.session.user_name
        res.locals.full_name = req.session.full_name

        const client = await pool.connect()
        var query = "select"
        query    += " u.fname, u.mname, u.lname,"
        query    += " ('(' || ac.area_code || ') ' || u.phone_number) as phone_number,"
        query    += " u.creation_date"
        query    += " from users u"
        query    += " inner join area_codes ac"
        query    += " on u.area_code_id = ac.area_code_id"
        query    += " where u.user_name = $1::varchar"
        const result = await client.query(query, [req.session.user_name])
        client.release()
        res.locals.user = result.rows[0]

        res.render('pages/AssetTracker/user')
      } catch (err) {
        console.error(err);
      }
    } else {
      req.session.returnPage = '/AssetTracker/UserAccount'
      return res.redirect('/AssetTracker/LoginServices')
    }
  })
  .get('/AssetTracker/LoginServices', async (req, res) => {
    if (typeof req.query.logout !== 'undefined') {
      if (req.query.logout == 1) {
        req.session.destroy(function(err) {
          if (err) {
            console.error(err);
          }
        })
      }
    }
    res.render('pages/AssetTracker/loginservices')
  })
  .get('/AssetTracker/loginpage', async (req, res) => {
    res.sendFile(path.join(__dirname, "views/pages/AssetTracker/loginpage.html"))
  })
  .get('/AssetTracker/newuserpage', async (req, res) => {
    res.sendFile(path.join(__dirname, "views/pages/AssetTracker/newuserpage.html"))
  })
  .post('/AssetTracker/login', async (req, res) => {
    try {
      const client = await pool.connect()
      var query = "select (fname || ' ' || lname) as full_name, user_name, hashed_password"
      query    += " from users where user_name = $1::varchar"
      const result = await client.query(query, [req.body.user_name])
      client.release()

      if (await bcrypt.compare(req.body.password, result.rows[0].hashed_password)) {
        console.log("Welcome!")
        req.session.user_name = result.rows[0].user_name;
        req.session.full_name = result.rows[0].full_name;  
      }

      if (typeof req.session.returnPage !== 'undefined') {
        return res.redirect(req.session.returnPage)
      } else {
        return res.redirect('/AssetTracker')
      }
    } catch (err) {
      console.error(err)
      return res.redirect('/AssetTracker/LoginServices')
    }
    res.end()
  })
  .get('/AssetTracker/newuser', async (req, res) => {
    if (req.body.password == "") {
      res.send("3");
      
    }

    if (req.body.password != req.body.c_password) {
      res.send("4");
    }

    try {
      const client = await pool.connect();
      var query = "select insert_user( ";
      query    += "$1::varchar, $2::varchar, $3::varchar, $4::varchar";
      query    += "$5::varchar, $6::varchar, $7::varchar)";
      var user_name = req.body.user_name;
      var password  = req.body.password;
      var fname     = req.body.fname;
      var mname     = req.body.mname;
      var lname     = req.body.lname;
      var number    = req.body.phone_number;
      var area_code = number.substring(1, 4);
      var phone_number    = number.substring(6);
      var hashed_password;
      bcrypt.hash(password, 8, function(err, hash) {
        hashed_password = hash;
      });

      const result = await client.query(query, [user_name, fname, lname, area_code, phone_number, hashed_password, mname]);
      client.release();
      res.send(result);
    } catch (err) {
      console.log(err)
    }
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