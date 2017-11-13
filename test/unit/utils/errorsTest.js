// requires
var chai = require('chai');
var should = chai.should();

var errors = require('../../../app_api/utils/errors');

// init errors module
errors.init();

describe('getError', function() {
    it('should return USERS_FILE_ERROR', function() {
        var error = errors.getError("USERS_FILE_ERROR", null, { 'info': 'additional details about error' });

        error.should.have.code = 1002;
        error.message.should.equal('Users file is not well formatted');
        error.details.should.deep.equal({
            info: 'additional details about error'
        });
    });

    it('should return SERVER_INTERNAL_ERROR', function() {
        var error = errors.getError("UNEXISTING_ERROR", null, { 'info': 'additional details about error' });

        error.should.have.code = 1000;
        error.message.should.equal('Server internal error');
        error.details.should.deep.equal({});
    });

    it('should return error with tokens replaced', function() {
        var error = errors.getError("USER_ALREADY_EXISTS", { 'email': 'email_test@test.com' }, { 'email': 'email_test@test.com' });

        error.should.have.code = 1004;
        error.message.should.equal('User already exists with email address: \'email_test@test.com\'');
        error.details.should.deep.equal({
            email: 'email_test@test.com'
        });
    });
});
