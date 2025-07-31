import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import  axios  from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;



export const AppContext = createContext()

export const AppProvider=({children})=>{
    const [ isAdmin , setIsAdmin] = useState(false)
    const [shows , setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    
 const navigate= useNavigate()
const {user} = useUser()
const {getToken} = useAuth()
const location = useLocation()

    const fetchIsAdmin = async()=>{
        try {
            const {data} = await axios.get("/api/admin/is-admin" ,{headers: {Authorization : `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)
            

            if(!data.isAdmin && location.pathname.startsWith("/admin")){
                navigate("/")
                toast.error("You are not authorized to access dashboard")
            }
        

        } catch (error) {
            console.error(error.message)
        }
    }


    const fetchShows = async()=>{
   try {
    const {data} = await axios.get("/api/show/all")
    if(data.success){
        setShows(data.shows)
    }else{
        toast.error(data.message)
    }
   } catch (error) {
    console.error(error.message)
   }
    }

const fetchFavoriteMovies = async()=>{
    try {
        const {data}= await axios.get("/api/user/favorites",{
            headers: {
            Authorization:`Bearer ${await getToken()}`
            
    }})

    if(data.success){
        setFavoriteMovies(data.movies)
    }else{
        toast.error(data.message)
    }
    } catch (error) {
        console.error(error.message)
    }
}




useEffect(()=>{
    fetchShows()
},[])

useEffect(()=>{
    if(user){
        fetchIsAdmin()
        fetchFavoriteMovies()
    }
},[user])

    const value = {
        axios,
        fetchFavoriteMovies,
        fetchIsAdmin,
        user,
        getToken, navigate, isAdmin, shows, favoriteMovies ,
        image_base_url,
        
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext =()=> useContext(AppContext)