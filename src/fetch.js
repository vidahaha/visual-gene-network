const API_HOST = "http://localhost:7001/"

const getNetWorkData = ( cb ) => {
	return fetch( API_HOST ).then( response => response.json() )
}

export default getNetWorkData