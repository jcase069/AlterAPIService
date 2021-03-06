# dLogit AlterAPIService

dLogit is a meal logging application for Android.  This is the back-end
processing application for Node.js, based on the Bluemix starter application
template.

Here is a link to the InVision prototype:  https://invis.io/TC4XN9EQV

Here is the dLogit project website: http://www.dlogit.com

## Files

The Node.js starter application has files as below:

* app.js

	This file contains the server side JavaScript code for your application
	written using the express server package.
	
* db.js

	Code for connecting to the production database, IBM DB2.
	
* sqlite.js

	Code for connecting to the test database, running on sqlite3.
	
* test.js

	Run this to test the operations on the test database, test.db
	
* test.db

	Sqlite database for testing.

* app/

	This directory contains the dynamic website content.

* config/

	This directory contains the configuration of the express web server,
	connecting the models, views and controllers.

* public/

	This directory contains public static files of the application, that will be
	served up by this server, e.g. javascript libraries, stylesheets and static 
	html files.
	
* sql/

	Sql scripts for creating and manipulating the relational tables.

* package.json

	This file contains metadata about your application, that is used by both
	the `npm` program to install packages, but also Bluemix when it's
	staging your application.  For more information, see:
	<https://docs.npmjs.com/files/package.json>
