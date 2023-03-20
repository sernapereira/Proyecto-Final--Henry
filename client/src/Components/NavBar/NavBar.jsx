import { Link } from "react-router-dom"
import SearchBar from "../SearchBar/SearchBar";
import style from './NavBar.module.css';
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import menu from '../../Assets/svg/menu.svg'
import carrito from '../../Assets/svg/carrito.svg';
import closemenu from '../../Assets/svg/closemenu.svg';
import logo from '../../Assets/svg/logo.svg';


export const NavBar = () => {
  const [clicked, setClicked] = useState(true);
  const cart = useSelector(state => state.cart?.cartItems ?? [])
  const menuopen = () => {
    setClicked(!clicked);
  };
  const Category = useSelector((state) => state.products.Categorias);

  return (
    <div className={style.container}>
      <div className={style.menu}>
        {clicked ? (
          <img
            src={menu}
            alt="icon nav"
            className={style.menuoff}
            onClick={menuopen}
          />
        ) : (
          <img
            src={closemenu}
            alt="icon nav"
            className={style.menuoff}
            onClick={menuopen}
          />
        )}
        <div
          className={`${style.containerOpciones} ${clicked ? style.opcioncerrada : null
            }`}
          onClick={() => setClicked(true)}
        >
          <ul
            className={`${style.opciones} ${clicked ? style.opcioncerrada : null
              }`}
          >
            {Category?.map((c) => (
              <li key={c.nombre}>
                <NavLink
                  to={`/productos/${c.nombre.toLowerCase()}`}
                  onClick={menuopen}
                >
                  {c.nombre.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase())}
                </NavLink>
              </li>
            ))}
             <li>
              <NavLink to="/productos/all" onClick={menuopen}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/form" onClick={menuopen}>
                Form
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos/all" onClick={menuopen}>
                Compra
              </NavLink>
            </li>
            <li>
              <NavLink to="/sobre-nosotros" onClick={menuopen}>
                Categorias
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos/all" onClick={menuopen}>
                Nosotros
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className={style.contenedorlogo}>
        <Link to="/home">
          <img src={logo} alt="logo" className={style.logo} />
        </Link>
      </div>

      <div className={style.search}><SearchBar></SearchBar></div>

      <div className={style.contenedorcarrito}>
        {cart.length ? <span className={style.span}>{cart.length}</span> : null}
        <Link to="/productos">
          <img src={carrito} alt="carrito" className={style.carrito} />
        </Link>
      </div>
      
     
    </div>
  );
};


export default SearchBar;
