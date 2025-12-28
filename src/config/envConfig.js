// Function to get the base API URL
// export const url = "http://10.10.20.57:8001/api/v1/";
// export const pdfUrl = "http://10.10.20.57:8001";
// export const imageUrl = "http://10.10.20.57:8001/uploads";

// export const url = "https://instagram-copyright-check-backend.onrender.com/api/v1";
// export const url = "https://webhook.xn--flexytche-g2a.com/api/v1";
export const url = import.meta.env.DEV ? "/api/v1" : "https://instagram-copyright-check-backend.onrender.com/api/v1";
export const pdfUrl = "https://instagram-copyright-check-backend.onrender.com";
export const imageUrl = "https://instagram-copyright-check-backend.onrender.com";

export const getBaseUrl = () => {
  return url.endsWith("/") ? url : `${url}/`;
};

export const getImageBaseUrl = () => {
  return imageUrl;
};

export const getPDFUrl = () => {
  return pdfUrl;
};

export const getImageUrl = (imagePath) => {
  if (imagePath.includes("https")) {
    return imagePath;
  }
  return `${imageUrl}${imagePath}`;
};
