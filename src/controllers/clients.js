const Auth = require('../middleware/auth.middleware');
const Client = require("../models/Client");
const Tenant = require("../models/Tenant");
const {path} = require("../config");
const {saveClient} = require('../service/client.service');

const COUNT_PER_PAGE = 50;

module.exports = function(app){

app.get(path("clients"), Auth, async (req, res) => {
	let data = req.body;
	let page = req.query.page;
	let clients = await Client.find({ tenant: data.tenant })
							  .skip((parseInt(page)-1)*COUNT_PER_PAGE)
							  .limit(COUNT_PER_PAGE);

	let total_items = await Client.countDocuments({tenant: data.tenant});
	res.send({data: clients, pages: Math.ceil(total_items/COUNT_PER_PAGE)});
})

app.post(path("clients/create"), Auth, async (req, res) => {
	let data = req.body;
	const tenant = await Tenant.findOne({ _id: data.tenant });
	await saveClient(data, tenant);
	res.send({message: 'Client added succesfully!'});
})

app.post(path("clients/import"), Auth, async (req, res) => {

	let data = req.body.bulk;
	const tenant = await Tenant.findOne({ _id: req.body.tenant });
	let clients = [];
	data.map(item => {
		let obj = item;
		obj.tenant = tenant;
		clients.push(obj);
	})
	try {
		await Client.insertMany(clients);
		res.send({message: 'Clients added succesfully!'});
	} catch (error) {
		console.log(error)
		res.status(404)
		res.send({ error: "Error!" })
	}
	
})

app.put(path("clients/:id"), Auth, async (req, res) => {
	
	try {
		const client = await Client.findOne({ _id: req.params.id })
		
		client.name = req.body.name;
		client.secondname = req.body.secondname;
		client.lastname = req.body.lastname;
		client.secondlastname = req.body.secondlastname;
		client.phone = req.body.phone;
		client.email = req.body.email;
		client. birthday = req.body.birthday;
		client.clientID =  req.body.clientID;
		client.state = req.body.state;
		client.city = req.body.city;
		client.address = req.body.address;
		client.zipcode = req.body.zipcode;


		await client.save()
		res.send(client)
	} catch(err) {
		console.log(err)
		res.status(404)
		res.send({ error: "Client doesn't exist!" })
	}
})


}