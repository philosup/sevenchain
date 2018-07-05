const csp = require('content-security-policy');
const JSON =require('json-bigint');

const cspPolicy = {
	'default-src' : csp.SRC_ANY,
	'script-src' : csp.SRC_ANY,
	'connect-src' : csp.SRC_ANY,
	'img-src' : csp.SRC_ANY,
	'font-src' : csp.SRC_ANY,
	'child-src' : csp.SRC_ANY,
	'form-src' : csp.SRC_ANY,
	'frame-ancestors' : csp.SRC_ANY,
	'stlye-src' : csp.SRC_ANY
};
const globalCSP = csp.getCSP(cspPolicy);

var express = require('express');
var app = express();
var bodyParser = require('body-parser-bigint');

var endpoint = 'http://10.44.1.107:8888';
var EosApi = require('eosjs-api');
var Eos = require('eosjs');
eos_config = {
	httpEndpoint: endpoint,
	chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
	keyProvider: [ '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3' ],
	sign: true,
	debuf: true
};


var eos_api = EosApi({ 
	httpEndpoint: endpoint
});
var eos = Eos(eos_config);

app.use(globalCSP);
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function(req, res){
	eos_api.getInfo({}).then(result => {
		//console.log(JSON.stringify(result, null, 2));
		res.send(result);
	});
});
//app.get('/get/table', function(req, res){
//	eos_api.getTableRows(true, 'seven.code', 'seven.code', req.query.name, 'id', req.query.id, -1, req.query.limit)
//		.then(result => res.send(result));
//});
app.get('/get/tablerows/:name/:id/:limit', function(req, res){
	eos_api.getTableRows(true, 'seven.code', 'seven.code', req.params.name, 'id', req.params.id, -1, req.params.limit)
		.then(result => {
			console.log(result.rows.length);
			res.send(result);
		}).catch(e => {
			console.error(e);
			res.send({result:"error"});
		});
});
app.get('/get/tableinfo', function(req, res){
	eos_api.getTableRows(true, 'seven.code', 'seven.code', 'tableinfo', 'id', 0, -1, 10)
		.then(result => {
			res.send(result);
		}).catch(e => {
			console.error(e);
			res.send({result:"error"});
		});
});
app.get('/get/table/:name/:id', function(req, res){
	eos_api.getTableRows(true, 'seven.code', 'seven.code', req.params.name, 'id', req.params.id, req.params.id+1, 1)
		.then(result => {
//			if(result != null && result.rows.length > 0)
//				res.send(result.rows[0]);
//			else
				res.send(result);
		}).catch(e => {
			console.error(e);
			res.send({result:"error"});
		});
});
app.get('/getinfo', function(req, res){
	eos_api.getTableRows(true, 'seven.code', 'seven.code', 'poker', 'id', 0, -1, 10)
		.then(result => res.send(result));
});
app.post('/slotsave', function(req, res){
	var json = JSON.parse(req.body);
	eos.contract('seven.code').then(function(sevenchain){
		return sevenchain.startslot(json.id, json.participants, json.rng,{authorization:['seven.code@active']});
		//return sevenchain.startslot({id:id, participants:JSON.parse(participants), rng:rng},{authorization:['seven.code@active']});
	}).then(function(result){
		//console.log("result : " + result);
      		res.send({result:"ok"});
	}).catch(e=>{
		console.error("catch : " + e);
      		res.send({result:"error"});
	});
});

app.post('/pokersave', function(req, res){
	var json = JSON.parse(req.body);
	eos.contract('seven.code').then(function(sevenchain){
		return sevenchain.startpoker(json.id, json.participants, json.rng,{authorization:['seven.code@active']});
	}).then(function(result){
      		res.send({result:"ok"});
	}).catch(e=>{
		console.error("catch : " + e);
      		res.send({result:"error"});
	});
});

var server = app.listen(80, function(){
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
});

console.log('Server Start');
