
_ = require('underscore')
Tube = require('tubes')

Tube.set('database', 'redis', [ 9470, 'perch.redistogo.com' ])

Tube.db.auth('37b9aef8dd751c61f2589b7aa1b10609')
Tube.publish.auth('37b9aef8dd751c61f2589b7aa1b10609')
Tube.subscribe.auth('37b9aef8dd751c61f2589b7aa1b10609')

Tube.set('templates directory', './views')
Tube.set('template engine', 'ejs')

//Tube.db.flushdb()

var dnode = require('dnode')()
    , nQuery = require('nodeQuery')
    , Express = require('express')
    , express = Express.createServer()

express
    .use(nQuery.middleware)
    .use(Express.static(__dirname + '/public'))
    .use(Tube.middleware)
    .listen(80)

nQuery
    .use(require('./lib/items'))
    .use(require('./lib/application'))

dnode
    .use(nQuery.middleware)
    .use(Tube.middleware)
    .listen(express)

