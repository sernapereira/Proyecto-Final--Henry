import  { getProducts, postProducts, getProdName, getDetail, getColors, getSize, clearProducts, clearDetail, clearColors, clearSize,  } from './productSlice';
import axios from 'axios';


// GET FUNCTIONS
const getAllProducts = () => {
    return async (dispatch) => {
        try {
            const dbData = (await axios(`/clothes/`)).data;
            return dispatch(getProducts(dbData));
        } catch (error) {
            alert({ error : error.message });
        };
    };
};

const postClothes= ({name, size, price, type, image, sex, stockGeneral, stoockSize, colors}) => {
    return async (dispatch) => {
        try {
            const product ={
                name: name,
                size: size,
                price: price,
                type: type,
                image: image,
                sex: sex,
                stockGeneral: stockGeneral,
                stoockSize: stoockSize,
                colors:colors,
            }
            const dbData = await axios.post(`/clothes/`, product);
            return dispatch(postProducts(dbData));
        } catch (error) {
        alert({error: error.message});
        }
    }
}


const getProductsByName = (name) => {
    return async (dispatch) => {
        try {
            const dbData = (await axios(`/clothes/?name=${name}`)).data;
            return dispatch(getProdName(dbData));
        } catch (error) {
            alert({ error : error.message });
        };
    };
};

const getProductDetail = (id) => {
    return async (dispatch) => {
        try {
            const dbData = (await axios(`/clothes/${id}`)).data;
            return dispatch(getDetail(dbData));
        } catch (error) {
            alert({ error : error.message });
        };
    };
};

const getAllColors = () => {
    return async (dispatch) => {
        try {
            const dbData = (await axios(`/colors/`)).data;
            return dispatch(getColors(dbData));
        } catch (error) {
            alert({ error : error.message });
        };
    };
};

const getAllSize = () => {
    return async (dispatch) => {
        try {
            const dbData = (await axios(`/size/`)).data;
            return dispatch(getSize(dbData));
        } catch (error) {
            alert({ error : error.message });
        };
    };
};

//CLEAR STATE FUNCTIONS
const clearProductsState = () => (dispatch) => {
    const clearState = [];
    return dispatch(clearProducts(clearState))
}
const clearProductDetailState = () => (dispatch) => {
    const clearState = [];
    return dispatch(clearDetail(clearState))
}
const clearColorsState = () => (dispatch) => {
    const clearState = [];
    return dispatch(clearColors(clearState))
}
const clearSizeState = () => (dispatch) => {
    const clearState = [];
    return dispatch(clearSize(clearState))
}

export { getAllProducts, postClothes, getProductsByName, getProductDetail, getAllColors, getAllSize, clearProductsState, clearProductDetailState, clearColorsState, clearSizeState }