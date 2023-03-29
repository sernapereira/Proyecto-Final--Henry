const {Clothes, Size, User, Op} = require('../db');
const sendEmail = require('../Cofig/mailer');

const createUser = async ({name, nickname, email, picture, admin}) => {
	try {
		// Buscar si ya existe un usuario con el mismo correo electrónico
		const existingUser = await User.findOne({where: {email}});
		if (existingUser) {
			return existingUser;
		} else {
			// Si no existe, crear un nuevo usuario
			let newUser = (
				await User.create({name, nickname, email, picture, admin})
			).dataValues;
			await sendEmail(newUser);
			return newUser;
		}
	} catch (error) {
		return {error: error.message};
	}
};

const getUsersData = async () => {
	const users = await User.findAll();
	return users;
};

const getUserByEmail = async (email) => {
	let userEmail = await User.findOne({where: {email}});

	if (userEmail) {
		return userEmail;
	} else {
		return 'usuario no encontrado';
	}
};

const {v4: uuidv4} = require('uuid');

const postInCart = async (id, clothe) => {
	// Obtener el usuario correspondiente
	const user = await User.findOne({where: {id}});

	// Agregar el artículo al carrito del usuario
	if (Array.isArray(clothe)) {
		clothe.forEach((item) => {
			item.cartIndex = uuidv4();
			user.cart.push(item);
		});
	} else {
		clothe.cartIndex = uuidv4();
		user.cart.push(clothe);
	}

	// Actualizar el registro del usuario en la base de datos
	await User.update({cart: user.cart}, {where: {id}});

	return user;
};

const deleteItem = async (userId, itemId) => {
	const user = await User.findOne({where: {id: userId}});

	if (!user) {
		throw new Error(
			`No se pudo encontrar el usuario con ID ${userId} que contenga el artículo con ID ${itemId}`
		);
	}

	const updatedUser = await user.update({
		cart: user.cart.filter((item) => item.cartIndex !== itemId),
	});

	return updatedUser;
};

let putItem = async (userId, cartIndex, newCantidad) => {
	const user = await User.findByPk(userId);
	const cart = user.cart;

	const productIndex = await cart.findIndex(
		(item) => item.cartIndex === cartIndex
	);

	if (productIndex === -1) {
		throw new Error('Producto no encontrado en el carrito.');
	}

	// Creo una nueva matriz de carrito con la cantidad actualizada
	const updatedCart = cart.map((item, index) => {
		if (index === productIndex) {
			return {
				...item,
				cantidad: newCantidad,
			};
		} else {
			return item;
		}
	});

	await user.update({cart: updatedCart});

	return user;
};

module.exports = {
	createUser,
	getUsersData,
	getUserByEmail,
	postInCart,
	deleteItem,
	putItem,
};
