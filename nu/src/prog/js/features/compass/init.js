var footer_left = {
	view: {
		text: 'Compile',
		classes: ''
	}
};

var footer_right = {
	view: {
		text: 'Watch',
		classes: 'btn-success'
	}
};

var header = {
	view: {
		text: 'Settings',
		classes: 'setting',
		icon: 'fugue-cog'
	}
};

var content = {
	template: '<pre><code>some foo</code></pre>',
	extraKlass: 'console',
	view: {},
	render: function() {
		return '<pre><code>/-------------------------------------------------------------------------------\\\n'+
	'|                                                                               |\n'+
	'| Sluraff Console                                                               |\n'+
	'|                                                                               |\n'+
	'| to log your output                                                            |\n'+
	'|                                                                               |\n'+
	'\\-------------------------------------------------------------------------------/\n';
	}
}
module.exports = {
	header: header,
	footer_left  : footer_left,
	footer_right : footer_right,
	content: content
};