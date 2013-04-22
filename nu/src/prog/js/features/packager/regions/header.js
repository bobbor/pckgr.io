var onClickFunction = function() {
	console.log('i am supposed to add a package')
};

var header = {
	view: {
		text: 'Add a Package',
		classes: 'add_package',
		icon: 'fugue-plus'
	},
	events: {
		'click button': onClickFunction
	}
};

module.exports = header;