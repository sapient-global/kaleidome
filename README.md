# kaleidoscope app by Sapient Nitro

This is an app made to play around with technology. Nowadays the work of the web developer has become so complex and demanding, that in lots of cases, there is just few time left to play. In Sapient Nitro we believe that playing is an important part of the creative work. Therefore, we invite you into the journey through this simple app and learn with us in the commented code of this app.

## Technology used

- npm / node
- gulp
- Webpack
- ES2015 with babel
- Sass, postCSS
- ESlint
- jscrc
- RequestAnimationFrame
- webRTC
- Canvas
- Firebase to connect to Twitter
- VanillaJS

## Installation

If you don't have yet gulp installed, run:
``sh
$ npm install -g gulp gulp-cli
``

Then

``sh
$ npm install
``
*Note:*

This has been tested only on the latest version of node, therefore to build this app, you will need to have an up-to-date version of node.

If your version is old, having a new version of node will bring you great benefits, for example, it [supports already without any flag some features of ES2015](https://nodejs.org/en/docs/es6/)

#Creating your self-signed certificate for local Development

If you don't have openSSL, install it.

Mac OS X:
``
$ brew install openssl
``
Windows
http://gnuwin32.sourceforge.net/packages/openssl.htm

GNU/Linux
``
$apt-get install openssl
``

### Generate private key and certificate signing request
``
$  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
...

$ openssl rsa -passin pass:x -in server.pass.key -out server.key
writing RSA key

$ rm server.pass.key
$ openssl req -new -key server.key -out server.csr

Country Name (2 letter code) [AU]:DE
State or Province Name (full name) [Some-State]:NRW
Locality Name (eg, city) []:Cologne
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Sapient
Organizational Unit Name (eg, section) []:XT
Common Name (e.g. server FQDN or YOUR name) []:
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:btconf2016
An optional company name []:
``
### Generate SSL certificate
The self-signed SSL certificate is generated from the server.key private key and server.csr files.

``
$ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
``

## Development mode

### dev server with Webpack

``sh
$ gulp serve
``
*Notes:*
This will be served under: https://localhost:9000, with this you can test the feature in your phone
when connected on the same wifi

### Create bundle for distribution

``sh
$ gulp build
``
Icons:
``html
<div>Icons made by <a href="http://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
``

http://www.flaticon.com/packs/multimedia-collection

### Configuring env variables in dokker

$ ssh dokku@sapient.space config wow

You can set a config variable by running

$ ssh dokku@sapient.space config:set wow CONFIG_VARIABLE=value ANOTHER_CONFIG=value
