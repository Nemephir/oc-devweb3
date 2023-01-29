const apiBase = `http://localhost:5678/api`

const main = async () => {
	await loadWorksAndCategories()
}

/*------------------------------------------------------------
 ----------                  WORKS                  ----------
 -----------------------------------------------------------*/

const loadWorksAndCategories = async () => {
	const [ categories, works ] = await Promise.all( [
		apiRequest( '/categories' ),
		apiRequest( '/works' )
	] )
	console.table( categories )
	console.table( works )

	buildWorks( works )
}

const buildWorks = ( works ) => {
	for( let i of works ) {
		buildWork( i )
	}
}

const buildWork = ( work ) => {
	console.log( work )
	const works = document.getElementById( 'works' )
	let figure  = addElement( 'figure', {}, works )
	let image   = addElement( 'img', {
		src        : work.imageUrl,
		alt        : work.title,
		crossOrigin: 'anonymous'
	}, figure )
	let caption = addElement( 'figcaption', {}, figure )
	addText( work.title, caption )
}

/*------------------------------------------------------------
 ----------                   API                    ----------
 -----------------------------------------------------------*/

const apiRequest = async ( route ) => {
	let url = apiBase + route
	console.log( url )
	const response = await fetch( url )
	if( response.status !== 200 ) {
		console.error( response )
		alert( `Erreur de connexion API :\n${response.status} ${response.statusText}` )
		return false
	}
	else {
		return await response.json()
	}
}

/*------------------------------------------------------------
 ----------                 HELPERS                 ----------
 -----------------------------------------------------------*/

const addElement = ( type, attributes, parent ) => {
	let element = document.createElement( type )

	// attributes
	for( let [ key, value ] of Object.entries( attributes ) ) {
		element[key] = value
	}

	// parent
	if( parent ) {
		parent.appendChild( element )
	}

	return element
}

const addText = ( value, parent ) => {
	let element = document.createTextNode( value )

	// parent
	if( parent ) {
		parent.appendChild( element )
	}

	return element
}

/*------------------------------------------------------------
 ----------                 PROCESS                 ----------
 -----------------------------------------------------------*/

main()