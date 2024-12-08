const BASE_URL = 'http://localhost:5000';

export const getData = async () => {
    const response = await fetch(`${BASE_URL}/`);
    return response.json();
};
