import { toast } from 'react-toastify';

const notify = (message) => toast(message, {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
});

export default notify;
