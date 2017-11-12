// requires
var fs = require('fs');
var uuid = require('node-uuid');
var utils = require('../utils/utils');
var errors = require('../utils/errors');
var constants = require('../utils/constants');

// users file path
var usersStorageFilePath = __dirname + '/../storage/users.json';

/** Retrieve users file. Send error response if something goes wrong.
 * @param res HTTP response object
 */
function readUsersFile(res) {
    try {
        // read users file
        var data = fs.readFileSync(usersStorageFilePath, "utf8");
        // parse content as JSON
        var jsonData = JSON.parse(data);
    } catch (exception) {
        // return exception
        return utils.sendJSONResponse(res, 500, { error: errors.getError("SERVER_INTERNAL_ERROR", null, exception) });
    }

    // check property exists and is an array
    if (!jsonData['users'] || !Array.isArray(jsonData['users'])) {
        return utils.sendJSONResponse(res, 400, { error: errors.getError("USERS_FILE_ERROR", null) });
    } else {
        return jsonData['users'];
    }
}

/** Write users file. Send error response if something goes wrong.
 * @param res HTTP response object
 */
function writeUsersFile(res, users) {
    try {
        // overwrite file with new content
        fs.writeFileSync(usersStorageFilePath, JSON.stringify({users: users}));
    } catch (exception) {
        // something went wrong
        return utils.sendJSONResponse(res, 500, { error: errors.getError("SERVER_INTERNAL_ERROR", null, exception) });
    }
}

/** Retrieve list of users.
 * @param req HTTP request object.
 * @param res HTTP response object
 */
var getUsersList = function (req, res) {
    // get users
    var users = readUsersFile(res);

    // get offset and limit from query params
    var offset = req.query.offset ? parseInt(req.query.offset) : 0;
    var limit = req.query.limit ? offset + parseInt(req.query.limit) : constants.USERS_LIMIT;
    // slice array based on offset and limit
    var usersSliced = users.slice(offset, limit);

    // respond with users list
    return utils.sendJSONResponse(res, 200, {msg: 'Successfully retrieved list of users', data: { count: usersSliced.length, users: usersSliced } });
};

/** Checks "req.body" contains all required info for an user and adds it to users file if successful.
 * @param req HTTP request object
 * @param res HTTP response object
 */
var createUser = function (req, res) {
    // body must contain required properties: email, forename
    if (!req.body.email || !req.body.forename) {
        return utils.sendJSONResponse(res, 400, { error: errors.getError("REQUIRED_BODY_PARAM_ERROR",
            { 'param': !req.body.email ? 'email' : 'forename' }) });
    }

    // get users
    var users = readUsersFile(res);

    // check email to be unique
    var duplicateUser = users.find(function(user) {
        return user.email === req.body.email;
    });

    if (duplicateUser) {
        // duplicate email address.
        return utils.sendJSONResponse(res, 400, { error: errors.getError("USER_ALREADY_EXISTS",
            { 'email': req.body.email }) });
    }

    // create a new user
    var userCreatedAt = new Date();
    users.push({
        id: uuid.v1(),
        email: req.body.email,
        forename: req.body.forename,
        surname: req.body.surname || '',
        created: userCreatedAt.getTime()
    });

    // add new users list (containing new added user) to the storage
    writeUsersFile(res, users);

    // respond with success and newly created user
    utils.sendJSONResponse(res, 201, {msg: 'Successfully created user',
        data: {
            user: {
                email: req.body.email,
                forename: req.body.forename,
                created: userCreatedAt.toISOString().slice(0, 10)
            }
        }
    });
};

/** Retrieve an user.
 * @param req HTTP request object.
 * @param res HTTP response object
 */
var retrieveUser = function (req, res) {
    // get users
    var users = readUsersFile(res);

    // find user by id
    var searchedUser = users.filter(function(user) {
        return user.id === req.params.userId;
    });

    if (searchedUser) {
        // respond with user
        return utils.sendJSONResponse(res, 200, {msg: 'Successfully retrieved user', data: { user: searchedUser } });
    } else {
        // user not found
        return utils.sendJSONResponse(res, 404, { error: errors.getError("USER_NOT_FOUND",
            { 'userId': req.params.userId }) });
    }
};

/** Modify an user.
 * @param req HTTP request object.
 * @param res HTTP response object
 */
var modifyUser = function (req, res) {
    // get users
    var users = readUsersFile(res);

    // find user by id
    var searchedUser = users.filter(function(user) {
        return user.id === req.params.userId;
    });

    if (searchedUser) {
        if (req.body.email) {
            searchedUser.email = req.body.email;
        }
        if (req.body.forename) {
            searchedUser.forename = req.body.forename;
        }
        if (req.body.surname) {
            searchedUser.surname = req.body.surname;
        }

        // add new users list (containing new modified user) to the storage
        writeUsersFile(res, users);

        // respond with modified user
        return utils.sendJSONResponse(res, 200, {msg: 'Successfully modified user', data: { user: searchedUser } });
    } else {
        // user not found
        return utils.sendJSONResponse(res, 404, { error: errors.getError("USER_NOT_FOUND",
            { 'userId': req.params.userId }) });
    }
};

/** Delete an user.
 * @param req HTTP request object.
 * @param res HTTP response object
 */
var deleteUser = function (req, res) {
    // get users
    var users = readUsersFile(res);

    // find user by id
    var searchedUserIndex = users.findIndex(function(user) {
        return user.id === req.params.userId;
    });

    if (searchedUserIndex) {
        // remove user from list
        var deletedUser = users.splice(searchedUserIndex, 1);

        // add new users list (not containing deleted user) to the storage
        writeUsersFile(res, users);

        // respond with modified user
        return utils.sendJSONResponse(res, 200, {msg: 'Successfully deleted user', data: { user: deletedUser[0] } });
    } else {
        // user not found
        return utils.sendJSONResponse(res, 404, { error: errors.getError("USER_NOT_FOUND",
            { 'userId': req.params.userId }) });
    }
};

module.exports = {
    getUsersList: getUsersList,
    createUser: createUser,
    retrieveUser: retrieveUser,
    modifyUser: modifyUser,
    deleteUser: deleteUser
};