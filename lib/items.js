var sanitizer = require('sanitizer')

module.exports = function ($, connection, client) { 
    var that = this;

    this.ItemsModel = Tube.Model.extend({
        'model': 'items',
        'listen': connection
    });

    this.ItemsView = Tube.View.extend({
    
        init: function (params) {
        
            // handle adding new todo
            $('#create-todo').live('submit', function () {
                $('#new-todo').serialize(function (d) {
                    var data = $.parseQuerystring(d);
                    for (var k in data) {
                      data[k] = sanitizer.sanitize(data[k])
                    }
                    params.model.create(data);
                    $('#new-todo').attr('value', '');
                });
            });
            
            // handle removing checked items
            $('.todo-clear a').live('click', function () {
                $('input').serialize(function (data) {
                    var d = $.parseQuerystring(data);
                    params.model.remove(d['checked']);
                });
            });
            
        },
        
        everyItem: function (item, model) {
        
            // handle todo destroy
            $('#'+item.id+' .todo-destroy').live('click', function () {
                model.remove(item.id);
            });
            
            // handle todo name edit 
            $('#'+item.id+' .todo-text').live('dblclick', function () {
                $('#'+item.id).attr('class', 'todo editing');    
            });
            
            // handle todo name edit 
            $('#'+item.id+' .edit input').live('blur', function () {
                $('#'+item.id+' .todo').removeClass('editing');
                $('#'+item.id+' .edit input').attr('value', function (v) {
                    item.name = sanitizer.sanitize(v)
                    model.update(item);
                });
            });
            
            // handle todo checkbox
            $('#'+item.id+' .display input').live('click', function () {  
                $('#'+item.id+' .display input').serialize(function (data) {
                    var d = $.parseQuerystring(data);
                    if (d['checked']) item.checked = 'done';
                    else item.checked = '';
                    model.update(item);
                });
            });
            
        },
        
        renderStats: function (items) {
            var done = _.pluck(items, 'checked');
            done = _.compact(done).length;
            var html = Tube.render(Tube.templates.stats, { 
                locals: { 'done': done, 'total': items.length }
            });
            $('#todo-stats').html(html);                
        },
        
        renderItems: function (items) {
            for (var k in items) this.renderItem(items[k]);
        },
        
        renderItem: function (item) {
            item.checked = item.checked || false;
            var html = Tube.render(Tube.templates.item, { 
                locals: { 'item': item }
            });
            $('#'+item.id).replaceWith(html);
        },
        
    });
        
    this.ItemsController = Tube.Controller.extend({
        initialize: function (params) {
            var self = this;
            this.model = new that.ItemsModel();
            this.view = new that.ItemsView();
            
            self.model.on('add', function (item) {
                $('#todo-list').prepend('<li id="'+item.id+'" > </li>');
                self.view.everyItem(item, self.model);
                self.view.renderItem(item);
                self.view.renderStats(self.model.collection);
            });
            
            self.model.on('remove', function (item) {
                $('#'+item.id).remove();
                self.view.renderStats(self.model.collection);
            });
            
            self.model.on('change', function (item) {
                self.view.renderItem(item);
                self.view.renderStats(self.model.collection);
            });
            
            self.model.on('change::collection', function (collection) {
                self.view.renderStats(collection);
            });
            
            self.view.init(self);
            
        },
        
    });

};
