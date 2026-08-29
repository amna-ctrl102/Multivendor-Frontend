import axios from "axios";
import { server } from "../../server";

// create Product
export const createProduct=(newForm)=> async (dispatch)=>{
    try{
        dispatch({
            type: "productCreateRequest",
        });
        const config= {headers:{"Content-Type":"multipart/form-data"}};
        
        const {data}= await axios.post(
            `${server}/product/create-product`,
            newForm,
            config,
           { withCredentials: true},
        );
        dispatch({
            type: "productCreateSuccess",
            payload: data.product,
        });

    }catch(error){
        dispatch({
            type: "productCreateFail",
            payload: error.response.data.message,
        });
    }
};

// get all products of a specific shop
export const getAllProductsShop=(id)=>async(dispatch)=>{
    try{
        dispatch({
            type: "getAllProductShopRequest",
        });
        const {data}= await axios.get(`${server}/product/get-all-products-shop/${id}`,{
            withCredentials: true,
        })
        dispatch({
            type: "getAllProductShopSuccess",
            payload: data.products,
        });

    }catch(error){
        dispatch({
            type: "getAllProductShopFail",
            payload: error.response.data.message,
        });
    }
};

export const deleteProduct=(id)=>async(dispatch)=>{
    try{
        dispatch({
            type: "deleteProductRequest",
        });

        const {data}= await axios.delete(`${server}/product/delete-shop-product/${id}`,{
            withCredentials: true,
        });
        dispatch({
            type: "deleteProductSuccess",
            payload: data.message,
        });

    }catch(error){
        dispatch({
            type: "deleteProductFail",
            payload: error.response.data.message,
        });
    }
};

// get products of all shops
export const getAllProducts=()=>async(dispatch)=>{
    try{
        dispatch({
            type: "getAllProductsRequest",
        });
        const {data}= await axios.get(`${server}/product/get-all-products`,{
            withCredentials: true,
        });
        dispatch({
            type: "getAllProductsSuccess",
            payload: data.allProducts,
        });


    }catch(error){
        dispatch({
            type: "getAllProductsFail",
            payload: error.response.data.message,
        });
    }
};