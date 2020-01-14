let API_HOST = "http://localhost:7001/"

if ( process.env.NODE_ENV === 'production' ) {
	API_HOST = "http://106.14.132.202:7001/"
}

export const getNetWorkData = ( cb ) => {
	return fetch( API_HOST, {credentials: 'include' } ).then( response => response.json() )
}

export const getDemoData = ( cb ) => {
	return fetch(  `${API_HOST}demo`, {credentials: 'include' } ).then( response => response.json() )
}

export const getNetWorkChange = ( cb ) => {
	return fetch( `${API_HOST}handle`, {credentials: 'include' } ).then( response => response.json() )
}

export const getDemoChange = ( cb ) => {
	return fetch(  `${API_HOST}demoh`, {credentials: 'include' } ).then( response => response.json() )
}

export const getNetWorkFile = ( cb ) => {
	return fetch( `${API_HOST}file`, {credentials: 'include' } ).then( response => response.json() )
}

export const COMMON_HOST = API_HOST

