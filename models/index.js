if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize');
    var sq = null;
    var fs = require('fs');
    var PGPASS_FILE = '../.pgpass';
    if (process.env.DATABASE_URL) {
        /* Remote database
           Do `heroku config` for details. We will be parsing a connection
           string of the form:
           postgres://bucsqywelrjenr:ffGhjpe9dR13uL7anYjuk3qzXo@\
           ec2-54-221-204-17.compute-1.amazonaws.com:5432/d4cftmgjmremg1
        */
        var pgregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        var match = process.env.DATABASE_URL.match(pgregex);
        var user = match[1];
        var password = match[2];
        var host = match[3];
        var port = match[4];
        var dbname = match[5];
        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            logging:  true //false
        };
        sq = new Sequelize(dbname, user, password, config);
        global.webroot = 'http://football-club-manager.herokuapp.com';
        global.apiroot = 'http://football-club-manager.herokuapp.com/api';
    } else {
        /* Local database
           We parse the .pgpass file for the connection string parameters.
        */
        var pgtokens = fs.readFileSync(PGPASS_FILE).toString().split(':');
        var host = pgtokens[0];
        var port = pgtokens[1];
        var dbname = pgtokens[2];
        var user = pgtokens[3];
        var password = pgtokens[4];
        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
        };
        var sq = new Sequelize(dbname, user, password, config);
        global.webroot = 'http://localhost:81';
        global.apiroot = 'http://localhost:81/api';
    }
    global.db = {
        Sequelize: Sequelize,
        sequelize: sq,
        Player: sq.import(__dirname + '/player')
    };
    global.weightEndurance = 0.15;
    global.weightSpeed = 0.15;
    global.weightDribble = 0.1;
    global.weightPass = 0.2;
    global.weightDefense = 0.15;
    global.weightShoot = 0.15;
    global.weightStrength = 0.1;
}
module.exports = global.db;
