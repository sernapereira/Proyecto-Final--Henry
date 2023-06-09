import { useState } from "react";
import { Hero } from "../../Components/Hero/Hero.jsx";
import Recomendados from "../../Components/Recomendados/Recomended.jsx";
import style from "./Home.module.css";
import { getAllProducts } from "../../Redux/ActionsGet.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CardContainer from "../../Components/CardContainer/CardContainer.jsx";
import imgHome from '../../Assets/img/hero3.jpg';
import  GenderCard  from "../../Components/Genders/GenderCards.jsx";
import { putClothes } from "../../Redux/ActionsGet.js";
import SatisfactionPopup from "../../Components/Calification/Calification.jsx";
import { getCart } from "../../Redux/actionCart.js";


export const Home = ()=>{

    const theUser = useSelector(state => state.user.theUser);//Nos traemos user para despues limitar que solo se ejecute la funcion si estamos loggeados.

    if(theUser.id){
      if(theUser.admin){
        window.location.href = "/admin/dashboard"
      }
    }
    
    const [home, setHome] = useState(true);
    const currentPurechase = JSON.parse(localStorage.getItem('currentPurechase'));
    const dispatch = useDispatch();

    const update = window.location.href.includes("approved")

    const [showSatisfactionPopup, setShowSatisfactionPopup] = useState(false); 
    // variable de estado para controlar la visualización del popup

    const stockController = async () => {
        if (theUser.id && update && currentPurechase && home) {
          setShowSatisfactionPopup(true); // cambiar el estado a true para mostrar el popup
          setHome(false);
          await dispatch(putClothes(currentPurechase))
            .then(() => {
              window.localStorage.removeItem("currentPurechase");
              dispatch(getCart())
            })
            .catch((error) => {
              console.log(error);
            });
        }
    };

    useEffect (()=>{
        dispatch(getAllProducts());
        stockController();
    }, [dispatch, currentPurechase]);

    if(theUser.id && theUser.admin) return (<div></div>)
    else return(
        <div className={style.container}>
            {showSatisfactionPopup && <SatisfactionPopup />} {/* mostrar el popup solo si showSatisfactionPopup es true sino no se muestra */}
            <img src={imgHome} alt="" className={style.img} />
            <Hero />
            <GenderCard />
            <CardContainer/>
        </div>
    )
}





