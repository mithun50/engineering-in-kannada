import { Bounce, toast, ToastPosition } from 'react-toastify';


export const dispatchToast=(message:string,position:ToastPosition)=>{
    toast(message, {
        position: position,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
        progressClassName: 'custom-progress',
    });
}