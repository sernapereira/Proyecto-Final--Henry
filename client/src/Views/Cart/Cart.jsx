import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCart, getLocalCart, deleteLocalCartItem} from '../../Redux/actionCart';
import { getUserByEmail, deleteTheItem, changeCantInTheItem } from '../../Redux/actionUser';
import {useAuth0} from '@auth0/auth0-react';
import style from './Cart.module.css';
import MercadoPago from '../../Components/MercadoPago/MercadoPago';

const Cart = () => {
	const dispatch = useDispatch();

	const {loginWithRedirect} = useAuth0();
	const theUser = useSelector((state) => state.user.theUser);

	let cart = useSelector((state) => state.cart.cartItems ? state.cart.cartItems : []);
	let canasta = useSelector((state) => state.cart.localStorageCart ? state.cart.localStorageCart : []);


	const fetchCart = () => {
		if (theUser.id) dispatch(getUserByEmail()).then(() => dispatch(getCart()));
		else dispatch(getLocalCart());
	};
	
	useEffect(() => {
		fetchCart()
	}, []);


	const [pagar, setPagar] = useState(true);

	let handleDelete = (index) => {
		if (theUser.id) dispatch(deleteTheItem(index)).then(() => fetchCart());
		// if(!theUser.id) console.log(index);
		if(!theUser.id) {
		dispatch(deleteLocalCartItem(index));
		fetchCart();
		}
	};


	const handleChangeCant = (item, change) => {
		let obj = {cantidad: item.cantidad + change};
		dispatch(changeCantInTheItem(item.cartIndex, obj));
	};

	const onSubmit = async (e) => {
		try {
			e.preventDefault();
			if (theUser.id) {
				setPagar(false);
			} else {
				loginWithRedirect();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<section clasName={style.section}>
			<img src='https://th.bing.com/th/id/R.ef110efa08c015b6beeadefa42eec32f?rik=xjNp1PX96ZPSqQ&riu=http%3a%2f%2fwww.llopmoda.com%2fwp-content%2fuploads%2f2017%2f11%2fslider_home_01.jpg&ehk=70QnEZPwYPw4EueKdodqV1uxiV1fq6Kgx4zb8MrHKxA%3d&risl=&pid=ImgRaw&r=0' alt='background' className={style.found} />
			<div className={style.tittleContent}>
				{theUser.id ? (
					<span className={style.logged}>You are logged</span>
				) : (
					<span className={style.noLogged}>You aren't logged</span>
				)}
				<h1 className={style.h1}>Your Cart:</h1>
			</div>
			<div className={style.cardContainer}>
			{cart.length
				? cart.map((item, i) => (
						<div key={i} className={style.itemContainer}>
							<div className={style.imgContainer}>
								<img className={style.img} src={item.image} alt={item.name}/>
							</div>
							<div className={style.descriptionContainer}>
								<h4 className={style.h4}>{item.name}</h4>
								<div className={style.porpsContent}>
									<p className={style.p}>Precio: <strong>{item.price}</strong>
									</p>
									<p className={style.p}>Color: {item.color}</p>
									<p className={style.p}>Talle: {item.size}</p>
								</div>
								<p className={style.p}>
									Cantidad:
									<button
										className={style.cantButton}
										onClick={() =>
											handleChangeCant(item, -1)
										}
									>
										-
									</button>
									{item.cantidad}
									<button
										className={style.cantButton}
										onClick={() =>
											handleChangeCant(item, 1)
										}
									>
										+
									</button>
								</p>
							</div>
							<div className={style.buttonContainer}>
								<button
									className={style.botonEliminar}
									onClick={() =>
										handleDelete(item.cartIndex)
									}
								>
									X
								</button>
							</div>
						</div>
					))
				: canasta?.map((item, i) => (
						<div key={i} className={style.itemContainer}>
							<div className={style.imgContainer}>
								<img className={style.img} src={item.image} alt={item.name}/>
							</div>
							<div className={style.descriptionContainer}>
								<h4 className={style.h4}>{item.name}</h4>
								<div className={style.porpsContent}>
									<p className={style.p}>Precio: <strong>{item.price}</strong>
									</p>
									<p className={style.p}>Color: {item.color}</p>
									<p className={style.p}>Talle: {item.size}</p>
								</div>
							</div>
							<div className={style.buttonContainer}>
								<button className={style.botonEliminar} onClick={() => handleDelete(i)}>
									X
								</button>
							</div>
						</div>
					))}
			</div>
			{pagar ? (
				cart.length || canasta.length
				?<button
					onClick={(e) => {
						onSubmit(e);
					}}
					className={style.botonComprar}
				>
					Confirmar
				</button>
				: <div className={style.empty}>Your cart is empty :(</div> 
			)
			: (
				<MercadoPago ids={cart} />
			)}
		</section>
	);
};

export default Cart;