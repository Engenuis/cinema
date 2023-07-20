const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev',
    timeout: 10000,
    headers: {'Content-Type': 'application/json'}
});

async function getData(phrase){
    const response = await api.get(phrase);
    const data = response.data.results;
    return data;
}
