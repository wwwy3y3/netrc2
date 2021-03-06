/**
 * Dependencies
 */

var netrc = require('../');
require('chai').should();


/**
 * Tests
 */

describe ('Netrc', function () {
	it ('should parse a valid netrc file', function () {
		var machines = netrc(__dirname + '/fixtures/valid-netrc');
		machines.should.have.property('default');
		machines.should.have.property('example.com');
		machines.should.have.property('example.org');
		
		machines['default'][0].should.equal('default_user');
		machines['default'][1].should.equal('default_password');
		
		machines['example.com'][0].should.equal('test_user');
		machines['example.com'][1].should.equal('test_password');
		
		machines['example.org'][0].should.equal('some_user');
		machines['example.org'][1].should.equal('');
	});
	
	it ('should format netrc file', function () {
		var machines = netrc(__dirname + '/fixtures/valid-netrc');
		machines['example.com'] = ['example_user', 'example_password'];
		
		var formatted = machines.toString();
		machines = netrc.parse(formatted);
		
		machines.should.have.property('default');
		machines.should.have.property('example.com');
		machines.should.have.property('example.org');
		
		machines['default'][0].should.equal('default_user');
		machines['default'][1].should.equal('default_password');
		
		machines['example.com'][0].should.equal('example_user');
		machines['example.com'][1].should.equal('example_password');
		
		machines['example.org'][0].should.equal('some_user');
		machines['example.org'][1].should.equal('');
	});

	it('should return empty object if netrc file not exist', function () {
		var machines = netrc(__dirname + '/fixtures/empty-netrc');
		machines.should.be.empty;
	})

	it('should delete a machine from netrc', function () {
		var machines = netrc(__dirname + '/fixtures/empty-netrc');

		// save an example.com
		machines['example.com'] = ['example_user', 'example_password'];
		machines.save();

		// check property
		machines.should.have.property('example.com');
		machines['example.com'][0].should.equal('example_user');
		machines['example.com'][1].should.equal('example_password');


		// delete it, and check netrc
		delete machines['example.com'];
		machines.save();

		// read netrc again
		// content should be empty
		netrc(__dirname + '/fixtures/empty-netrc').should.be.empty;
	})
});