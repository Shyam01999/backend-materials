import { toast } from "react-toastify";

const toasterProperty = {
    position: "top-right",
    autoClose: 3000
}

export const notifySuccess = (message) => {
  toast.success(message, toasterProperty);
};

export const notifyError = (message) => {
  toast.error(message, toasterProperty);
};

export const notifyWarning = (message) => {
  toast.warning(message, toasterProperty);
};

export const notifyInfo = (message) => {
  toast.info(message, toasterProperty);
};