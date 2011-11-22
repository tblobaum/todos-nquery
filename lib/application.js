module.exports = function ($, connection, client) {
    var that = this;
    
    that.AppModel = Tube.Model.extend({
        'model': 'app',
        'listen': connection 
    });
    
    that.AppView = Tube.View.extend({
        initialize: function (params) { 
            $('body').append(Tube.templates.app);
        }
    });
    
    that.AppController = Tube.Controller.extend({
        initialize: function (params) {
            this.model = new that.AppModel();
            this.view = new that.AppView();
            this.items = new that.ItemsController();
        },
    });
    
    $.on('ready', function (ready) {
        var app = new that.AppController(); // make a new instance of the app
        app.items.model.all(); //bootload the data
        ready();
    });
};

