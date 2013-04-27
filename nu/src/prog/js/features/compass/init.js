var content      = require('./regions/content.js');
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

module.exports = {
	header: header,
	footer_left  : footer_left,
	footer_right : footer_right,
	content: content
};