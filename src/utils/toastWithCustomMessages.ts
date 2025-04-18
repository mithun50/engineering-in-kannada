import { Bounce, toast } from 'react-toastify';

export const dispatchToast=(message:string)=>{
    toast(message, {
        position: 'top-right',
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