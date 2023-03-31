const {Clothes, Size, Colors} = require('../db');

const {clothesBdd} = require('../basesDeDatos/dataGeneral');

let getClothesData = async (searchClothe) => {
	const clothesData = await clothesBdd();

	if (searchClothe) {
		const clothes = clothesData.filter((e) =>
			e.name.toLowerCase().includes(searchClothe.toLowerCase())
		);

		if (!clothes.length) {
			throw Error('Prenda no encontrada');
		}

		return clothes;
	}

	return clothesData;
};

////////////////////////////////////////

let getIdData = async (id) => {
	const clothesData = await getClothesData();

	let dataId = clothesData.find((e) => e.id == id);

	if (dataId) {
		return dataId;
	} else {
		throw Error('Prenda no encontrado');
	}
};

/////////////////////////////////////////////

const createProduct = async (
	name,
	price,
	type,
	image,
	sex,
	stockGeneral,
	stockSize,
	size,
	colors,
	existing
) => {
	const ajuste = colors
		.map((elem) => elem.stockColors)
		.reduce((acc, item) => {
			return acc + parseInt(item);
		}, 0);
	stockGeneral = ajuste;
	stockSize = ajuste;

	existing = stockSize > 0 ? true : false;

	let create = await Clothes.create({
		name,
		price,
		type,
		image,
		sex,
		stockGeneral,
		existing,
	});
	let createTalla = await Size.create({
		size,
		stockSize,
		colors,
	});

	create.addSize(createTalla);

	return {message: 'Product Create !!!!!'};
};

let getGenderData = async (gender) => {
	const clothesData = await getClothesData();

	const filteredData = clothesData.filter((item) =>
		item.sex.includes(gender)
	);

	if (filteredData.length === 0) {
		throw new Error('Genero no encontrado');
	}

	return filteredData;
};

//////////////////////////////////////////////

const clothesUpdates = async (ids) => {
	//llamamos al modelos y lo guardamos en una variable (dataDb) que nos va ayudar a modificar su valor
	let data = ids;
	let dataDb = await Size.findByPk(data.id);
	//la siguiente variable tendra el valor modificado y es la que vamos a usar como el dato final
	let aux = dataDb;
	let aux2 = dataDb;

	//hacemos la logica que busque el color al que vamos a cambiar su stock
	dataDb = dataDb.colors.filter((elem) => elem.color === data.color);

	//hacemos la segunda logica que cambia el stock del color encontrado y que modifica el stock
	if (dataDb[0].stockColors < data.cantidad) {
		return [
			{message: `solo tenemos ${dataDb[0].stockColors} en stock`},
			{status: 401},
		];
	} else if (dataDb[0].stockColors === 0) {
		alert;
		return [{message: 'Nuestro stock esta en 0'}, {status: 400}];
	} else {
		dataDb[0].stockColors -= data.cantidad;
	}

	//al terminar estos cambios estaran guradados en la variable "aux"

	//hacemos la logica que va cambiar a los demas stock
	aux2 = aux2.colors
		.map((elem) => Number(elem.stockColors))
		.reduce((acc, item) => (acc += item));

	await Size.update(
		//por ultimo le damos el valor a colors de "aux.colors" el cual tiene el nuevo stock modificado
		{
			colors: aux.colors,
			stockSize: Number(aux2),
		},
		{
			where: {
				id: data.id,
			},
		}
	);
	// actualizamos el modelo Clothes y le actualizamos el stock general

	await Clothes.update(
		{
			stockGeneral: Number(aux2),
		},
		{
			where: {
				id: data.id,
			},
		}
	);
};

let clothesUpdate = async (ids) => {
	await ids.forEach(el => clothesUpdates(el));
};

const generalUpdate = async (
	idItem,
	name,
	price,
	type,
	image,
	sex,
	size,
	colors
) => {
	const ajuste = colors
		.map((elem) => elem.stockColors)
		.reduce((acc, item) => {
			return acc + parseInt(item);
		}, 0);
	const stockGeneral = ajuste;
	const stockSize = ajuste;
	const existing = stockSize > 0 ? true : false;

	let product = await Clothes.findByPk(idItem);

	product.name = name;
	product.price = price;
	product.type = type;
	product.image = image;
	product.sex = sex;
	product.stockGeneral = stockGeneral;
	product.existing = existing;

	await product.save();

	let productSize = await Size.findOne({
		where: {id: idItem},
	});

	productSize.size = size;
	productSize.stockSize = stockSize;
	productSize.colors = colors;

	await productSize.save();

	return {message: 'Product actualizado'};
};

module.exports = {
	getClothesData,
	getIdData,
	createProduct,
	getGenderData,
	clothesUpdate,
	generalUpdate,
};
