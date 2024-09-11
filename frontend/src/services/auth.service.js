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
      console.log('Response data:', response.data);
      return response?.data?.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      throw error; // Re-throw the error to handle it in the component
    }
  };
