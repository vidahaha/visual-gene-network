const API_HOST = "http://localhost:7001/"

export const getNetWorkData = ( cb ) => {
	return fetch( API_HOST ).then( response => response.json() )
}

export const getNetWorkChange = ( cb ) => {
	return fetch( `${API_HOST}handle` ).then( response => response.json() )
}
