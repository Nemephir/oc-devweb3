const apiBase = `http://localhost:5678/api`
let currentCategory = 0

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
	buildCategories( categories )
}

const buildWorks = ( works ) => {
	for( let i of works ) {
		buildWork( i )
	}
}

const buildWork = ( work ) => {
	const works = document.getElementById( 'works' )
	let figure  = addElement( 'figure', {
		className: 'work',
		'data-work': work.id,
		'data-category': work.category.id
	}, works )
	let image   = addElement( 'img', {
		src        : work.imageUrl,
		alt        : work.title,
		crossOrigin: 'anonymous'
	}, figure )
	let caption = addElement( 'figcaption', {}, figure )
	addText( work.title, caption )
}

const buildCategories = ( categories ) => {
	buildCategory( 0, 'Tous', true )
	for( let i of categories ) {
		buildCategory( i.id, i.name )
	}
}

const buildCategory = ( id, name, active = false ) => {
	const categories = document.getElementById( 'categories' )

	const classNames = [ `badge` ]
	if( active ) classNames.push( `active` )

	let li    = addElement( 'li', {}, categories )
	let badge = addElement( 'span', {
		className: classNames.join( ' ' )
	}, li )
	addText( name, badge )

	badge.addEventListener('click', e => {
		if( currentCategory !== id ) {
			document.querySelector('#categories .active').classList.remove('active')
			e.target.classList.add('active')
			currentCategory = id
			filterWorksByCategory(id)
		}
	})
}

const filterWorksByCategory = (categoryId) => {
	let works = document.querySelectorAll(`#works .work`)
	for( let work of works ) {
		work.style.display = categoryId === 0 || Number(work.dataset.category) === categoryId
			? 'block'
			: 'none'
	}
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
		if( key.startsWith('data-') ) {
			key = key.replace('data-', '')
			element.dataset[key] = value
		}
		else {
			element[key] = value
		}
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