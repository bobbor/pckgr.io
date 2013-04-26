var _ = require('underscore');

var onClickFunction = function() {
	console.log('i am supposed to add a package')
};

var template =
'<div class="actions btn-group">'+
	'<button type="button" class="btn btn-small expandable <%= classes %>">'+
		'<i class="<%= icon %>"></i> <%= text %>'+
	'</button>'+
'</div>';

var coreTemplateFront = '<div><ol class="packages">';
var coreTemplateBack = '</ol></div>';
var packageTemplateFront = 
'<li>'+
	'<div>'+
		'<table class="table">'+
			'<caption class="toggle-actions">'+
				'<h3><input class="editableinput" type="text" value="<%= package %>"/></h3>'+
				'<div class="actions pull-right btn-group">'+
					'<button type="button" class="btn btn-small expandable"><i class="fugue-plus"></i> Add a File</button>'+
					'<button type="button" class="btn btn-small expandable"><i class="fugue-plus"></i> Add a Module</button>'+
					'<button type="button" class="btn btn-small btn-danger expandable"><i class="fugue-trash"></i> Delete Package</button>'+
				'</div>'+
			'</caption>'+
			'<thead>'+
				'<tr>'+
					'<td>Filename</td>'+
				'</tr>'+
			'</thead>'+
			'<tbody>';
var packageTemplateBack =
			'</tbody>'+
		'</table>'+
	'</div>'+
'</li>';
var fileTemplate = 
'<% for(var i = 0; i < files.length; i++) { %>'+
	'<tr>'+
		'<td>'+
			'<div class="toggle-actions">'+
				'<h5 class="name pull-left">'+
					'<span class="title" title="<%= files[i] %>"><%= files[i] %></span>'+
					'<span class="label label-info" data-rel="validate" style="display: none">no validate</span>'+
					'<span class="label label-info" data-rel="minify" style="display: none">no minify</span>'+
				'</h5>'+
				'<div class="actions btn-group pull-right">'+
					'<button class="btn dropdown-toggle btn-small expandable" data-toggle="dropdown">'+
						'<i class="fugue-cog"></i> Options <span class="caret"></span>'+
					'</button>'+
					'<ul class="dropdown-menu">'+
						'<li class="checkbox-item">'+
							'<a href="#" data-control="validate"><i class="fugue-check-empty"></i>do not validate</a>'+
						'</li>'+
						'<li class="checkbox-item">'+
							'<a href="#" data-control="minify"><i class="fugue-check-empty"></i>do not minify</a>'+
						'</li>'+
						'<li class="divider"></li>'+
						'<li><a href="#">delete</a></li>'+
					'</ul>'+
				'</div>'+
			'</div>'+
		'</td>'+
	'</tr>'+
'<% } %>';

var view = {
	text: 'Add a Package',
	classes: 'add_package',
	icon: 'fugue-plus'
};

var content = {
	plugs: ['stickHead'],
	render: function(conf) {
		var str = coreTemplateFront;
		for(var i = 0, p = conf.packageList; i < p.length; i++) {
			if(p[i] === p[i]+'') {
				if(i !== 0) {
					str += packageTemplateBack;
				}
				str += _.template(packageTemplateFront, {
					package: p[i]
				});
			} else {
				str += _.template(fileTemplate, { files: p[i] });
			}
		}
		return str + packageTemplateBack + coreTemplateBack;
	},
	events: {
		'click button': onClickFunction
	}
};

module.exports = content;