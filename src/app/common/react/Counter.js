import React from 'react';

export default () => (
	<>
		<dl>
			<dt>id</dt>
			<dd>value</dd>
		</dl>
		<button onClick={(ev) => ev.preventDefault()}>Incrémenter</button>
		<button onClick={(ev) => ev.preventDefault()}>Décrémenter</button>
	</>
);
