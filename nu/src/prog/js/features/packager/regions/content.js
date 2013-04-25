var onClickFunction = function() {
	console.log('i am supposed to add a package')
};

var header = {
	template:
			'<div class="actions btn-group">\
				<button type="button" class="btn btn-small expandable <%= classes %>">\
					<i class="<%= icon %>"></i> <%= text %>\
				</button>\
			</div>',
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