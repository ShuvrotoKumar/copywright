// Function to get the base API URL

export const url = "https://api.copyrightchecker.de/api/v1";
export const pdfUrl = "https://api.copyrightchecker.de";
export const imageUrl = "https://api.copyrightchecker.de";

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
