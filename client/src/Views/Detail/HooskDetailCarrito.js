import { useDispatch } from "react-redux";
import { useState } from "react";
// import { useSelector } from "react-redux";
import { putClothes } from "../../Redux/ActionsGet";




export const useDetail = (myProduct, id) => {

  const [error, setError] = useState({});
  const [compra, setCompra] = useState({
    id: id,
    size: "",
    color: "",
    price: "",
    cantidad: 1,
  });
  const [carrito, setCarrito] = useState([]);

  const dispatch = useDispatch();

  const handlerCompraChange = (e) => {
    const { name, value } = e.target;
    setCompra({
      ...compra,
      [name]: value,
    });
  };

  const handlerColors = (e) => {
    setCompra({
      ...compra,
      color: e.target.value,
    });
  };

  const handlerCantidad = (e) => {
    setCompra({
      ...compra,
      cantidad: Number(e.target.value),
    });
  };

  const handlerSize = (e) => {
    setCompra({
      ...compra,
      size: e.target.value,
    });
  };

  const buttonComprar = (e) => {
    setCompra({
      ...compra,
      id: myProduct.id,
      price: myProduct ? myProduct.price : "error",
    });
    dispatch(putClothes(compra))
    alert ("compra exitosa")
  };

  const buttonAgregarAlCarrito = (e) => {
    const colores = myProduct ? myProduct.sizes?.flatMap(el => el.colors[0].color): 'no colors';
    const talla = myProduct ? myProduct.sizes?.flatMap(el => el.size) : 'no sizes found';
    setCarrito([
      ...carrito,
      {
        ...compra,
        id: myProduct.id,
        price: myProduct ? myProduct.price : "error",
        color: colores[0],
        size: talla[0],
      },
    ]);
    
  };
  const [pagar, setPagar] = useState(true)
  const onSubmit = async (e) => {
    e.preventDefault()
    setPagar(false)
  }
  console.log(carrito);

  return {
    pagar,
    error,
    compra,
    carrito,
    handlerCompraChange,
    buttonComprar,
    handlerColors,
    handlerCantidad,
    handlerSize,
    buttonAgregarAlCarrito,
    onSubmit,
  };
};