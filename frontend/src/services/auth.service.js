import axiosInstance from "./url.service";

//signup user
export const registerUser = async(userData)=>{
    try {
        const response= await axiosInstance.post('/auth/register',userData)
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}


//signin user
export const loginUser = async(userData)=>{
    try {
        const response= await axiosInstance.post('/auth/login',userData)
        return response.data;
    } catch (error) {
         console.log(error)
    }
}

//user logout
export const logout = async()=>{
    try {
        const response= await axiosInstance.get('/auth/logout')
        return response.data;
    } catch (error) {
        console.log(error)
    }
}


export const checkUserAuth = async () => {
  try {
    const response = await axiosInstance.get('/users/check-auth');
    if(response?.data?.status === 'success'){
        return { isAuthenticated: true, user: response?.data?.data };
    }
    else if (response.status === 401) {  
        return { isAuthenticated: false };
      }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return { isAuthenticated: false };
  }
};