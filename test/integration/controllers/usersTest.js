// requires
var async = require('async');
var fs = require('fs');
var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../../../app');
var constants = require('../../../app_api/utils/constants');

// users file path
var usersStorageFilePath = __dirname + '/../../../app_api/storage/users.json';
var usersStorageDefaultFilePath = __dirname + '/../../../app_api/storage/users.json.default';

var basePath = '/api/users';
var retrieveUsersPath = basePath;
var createUserPath = basePath;
var retrieveUserPath = basePath;
var modifyUserPath = basePath;
var deleteUserPath = basePath;

chai.use(chaiHttp);

var users = [];

/** Read default file and write its content to actual-used file
 * */
function readDefaultContentAndAddToActualFile() {
    // read default file
    var data = fs.readFileSync(usersStorageDefaultFilePath, "utf8");

    // write default content
    fs.writeFileSync(usersStorageFilePath, data);
}

describe('API tests', function () {
    var usersToAdd = 5;

    // Before test suite, empty the users file
    before(function (done) {
        readDefaultContentAndAddToActualFile();

        done();
    });

    // After test suite, empty the users file
    after(function (done) {
        readDefaultContentAndAddToActualFile();

        done();
    });

    // Test API: retrieve users
    describe('GET /api/users', function () {
        it('it should retrieve no users', function (done) {
            chai.request(server)
                .get(retrieveUsersPath)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.users.should.be.a('array');
                    res.body.data.users.length.should.be.eql(0);
                    res.body.data.count.should.equal(0);

                    done();
                });
        });
    });

    // Test API: create user
    describe('POST /api/users', function () {
        it('it should add {usersToAdd} new users', function (done) {
            // async tasks
            var asyncTasks = [];

            for (var i = 0; i < usersToAdd; i++) {
                var wrapFunction = function(i) {
                    asyncTasks.push(function(callback) {
                        var email = 'user' + i + '@test.com';
                        var forename = 'user' + i;

                        chai.request(server)
                            .post(createUserPath)
                            .send({
                                'email': email,
                                'forename': forename
                            })
                            .end(function (err, res) {
                                res.should.have.status(201);
                                res.body.data.user.email.should.equal(email);
                                res.body.data.user.forename.should.equal(forename);

                                // keep reference to users
                                users.push(res.body.data.user);

                                setTimeout(callback, 100);
                            });
                    });
                };

                wrapFunction(i);
            }

            async.series(asyncTasks, function(err, result) {
                done();
            });
        });
    });

    // Test API: create user
    describe('POST /api/users', function () {
        it('it should reject creating an user with existing email address', function (done) {
            var email = 'user1@test.com';
            var forename = 'user1';

            chai.request(server)
                .post(createUserPath)
                .send({
                    'email': email,
                    'forename': forename
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.error.code.should.equal(1004);

                    done();
                });
        });
    });

    // Test API: retrieve an user
    describe('GET /api/users/:userId', function () {
        it('it should retrieve an user', function (done) {
            chai.request(server)
                .get(retrieveUserPath + '/' + users[0].id)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.user.id.should.equal(users[0].id);

                    done();
                });
        });
    });

    // Test API: retrieve an user
    describe('GET /api/users/:userId', function () {
        it('it should fail retrieving an unexisting user', function (done) {
            chai.request(server)
                .get(retrieveUserPath + '/unexisting_user_id')
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.body.error.code.should.equal(1003);

                    done();
                });
        });
    });

    // Test API: modify user
    describe('PUT /api/users', function () {
        it('it should modify user', function (done) {
            var newEmail = 'user10@test.com';

            chai.request(server)
                .put(modifyUserPath + '/' + users[0].id)
                .send({
                    'email': newEmail
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.user.email.should.equal(newEmail);

                    // remove old user
                    users.slice(0, 1);
                    // add modified user
                    users.push(res.body.data.user);

                    done();
                });
        });
    });

    // Test API: delete user
    describe('DELETE /api/users', function () {
        it('it should delete user', function (done) {
            chai.request(server)
                .delete(deleteUserPath + '/' + users[0].id)
                .end(function (err, res) {
                    res.should.have.status(200);

                    done();
                });
        });
    });

    // Test API: retrieve users
    describe('GET /api/users', function () {
        it('it should retrieve (usersToAdd-1) users', function (done) {
            chai.request(server)
                .get(retrieveUsersPath)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.users.should.be.a('array');
                    res.body.data.users.length.should.be.eql(usersToAdd-1);
                    res.body.data.count.should.equal(usersToAdd-1);

                    done();
                });
        });
    });

    // Test API: retrieve users with offset
    describe('GET /api/users with offset', function () {
        it('it should retrieve first {limit} users', function (done) {
            var limit = 2;
            chai.request(server)
                .get(retrieveUsersPath)
                .query( {offset: 0, limit: limit} ) // ?offset=0&limit=2
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.users.should.be.a('array');
                    res.body.data.users.length.should.be.eql(limit);
                    res.body.data.count.should.equal(limit);

                    done();
                });
        });
    });
});