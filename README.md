# Table of contents
<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Table of contents](#table-of-contents)
- [kaleidoscope app by Sapient Nitro](#kaleidoscope-app-by-sapient-nitro)
	- [Technology used](#technology-used)
	- [Installation](#installation)
	- [Structure of the project](#structure-of-the-project)
	- [Development mode](#development-mode)
		- [dev server with Webpack](#dev-server-with-webpack)
		- [Runing it as if you were in production](#runing-it-as-if-you-were-in-production)
	- [Create bundle for distribution](#create-bundle-for-distribution)
	- [Our camera icon](#our-camera-icon)
		- [Configuring env variables in dokker](#configuring-env-variables-in-dokker)

<!-- /TOC -->

# kaleidoscope app by Sapient Nitro

This is an app made to play around with technology.

Nowadays the work of the web developer has become so complex and demanding, that in lots of cases, there is just few time left to play.

In Sapient Nitro we believe that playing is an important part of the creative work. Therefore, we invite you into the journey through this simple app and learn with us in the commented code of this app.

## Technology used

There is no religious reason why we have chosen to use this technical stack.
We believe that there is a tool for each need and that a good developer is
able to switch to another tool when it gives them more benefits.

We chose the set of tools we wanted to play with.

- **npm / node** > 5.8.0.
Strictly over 5.8, so we can use the already supported ES2016 without babel in the server

- **gulp**
Just because

- **Webpack.**
We wanted to know what the big fuzz about webpack is. Also we wanted to use it without ReactJS.

Note: No, we did not spent 1 week configuring webpack. There are lots of boilerplates around that help you saving that week.

- **ES2015 with babel**
We feel like a kid on Christmas. We are really happy about the new features, therefore, we wanted to use them.

Note: ES2015 !== ReactJS.

- **Sass, postCSS**
PostCSS is quite a nice tool, we have been slowly integrating it into our workflow, and we can say that is one of those tools that really help you. Keeping track of the code quality in CSS with a preprocessor can be sometimes overlooked, but with [a good setup](http://www.sitepoint.com/improving-the-quality-of-your-css-with-postcss/), PostCSS can be a great help

- **CSS3 animations for the loading indicator**
More details about it, you can find under styles/modules/animations.scss...

In Firefox it looks squared. For some reason doing overflow: hidden on a 50% border-radius element, does not hide the parts that are between the square and the circle... If you know a fix for this or the reason, a pull request is the way to go.

What is interesting here is the technique to time two different animations.

- **scss-lint**
Well, it is nice and has a set of rules that allow you to check your styles after errors. The only "but" is that depends on Ruby, and not all the time you can use ruby.

Recently we learned about another tool: [stylelint](https://github.com/stylelint/stylelint), we are already using it for some projects, and we can say that we are quite happy with it. It can be used with grunt, but you need postCSS for it :). It integrates easier with gulp. You can also develop your custom rules.

If you can decide which lintin tool you will use for a project, we recommend you to have a look into stylelint, it worth to check it out.

- **ESlint**
When we started using ESlint was quite confusing, overall the syntax to configure rules, once you get used to it, it can be quite a powerful tool. It helps you check for errors in your code, and now that [JSCS has joined the team](http://eslint.org/blog/2016/04/welcoming-jscs-to-eslint), will also check after styles.

- **JSCS**
We are using the goolge preset with JSCS, it can be quite strict, but it is a great way to ensure that the guidelines are being followed. During the time, the JSCS team will work together with the ESlint team to make a the transition possible, in the meantime, we are glad to use the tool

- **RequestAnimationFrame**
Last year the Performance Advocates from Google, presented in Google I/O, the RAIL model for Performance.
One of the parts of this model is to ensure that your frames are rendering [under 16ms](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/rail?hl=en#animation-render-frames-every-16ms). RequestAnimationFrame helps you to do that

- **webRTC**
webRTC is an API that allows the browser to capture audio and video. To write and learn about this is a big long road, however promises to be exiting. Basically the idea of doing this app, was motivated by our desire to play with it. We can say that it is way simpler than we thought, at least under the scope of this app.

- **Canvas API**
The canvas API allows you to draw stuff with JS in the browser. Also it allows you to convert the stream of data you are giving it into an image... Quite conventient when you want to make a kaleidoscope app.

It is also easy to learn, check out the documentation [here](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

- **VanillaJS**
In the era of frameworks, writing vanillaJS has become kind of the new [Chucky](http://cdn.wegotthiscovered.com/wp-content/uploads/curse-chucky-610x343.jpg), handling the DOM without jQuery or a framework, can seem so complicated that we tend to just use a library for it.

Well, we wanted to challenge that idea, [youMightNotNeedjQuery.com](http://youmightnotneedjquery.com/) is a good place to start if you want also to start trying the misterious vanillaJS. Also, while working on this project, we learnt that not using a framework with ES2015, is like a day on a boat on a lake, is a very enjoyable experience.

- **Jade**
If you never used it before, or never have worked with coffeeScript or such, jade can look quite ugly. However, once you get it, it is ok. We chose it because we wanted to go out of our confort zones and learn what Jade has to give. With this tiny project is hard to get the full picture of it, but at least a beginner view we got

- **dokku**
Dokky is a PaaS that gives developers a bunch of tools to manage their sites in a server. Have you hear about heroku? Well, this is a mini heroku.


**NOTE**
We have been very bad developer-citizens and we did not write tests. There is no excuse for that.
Never do that, use always tests, working with tests helps you to prevent bugs in the future when your codebase grows. Also, after you learn, you can become even faster, you can write super complex algorithms
relying on their behaviour. This particular topic give content to write a lot, therefore, to keep it short, we apologize for not having tests, to show you how to integrate tests into this setup.

## Installation

If you don't have yet gulp installed, run:
```
$ npm install -g gulp gulp-cli
```

Then

```
$ npm install
```

*Note:*

This has been tested only on the latest version of node, therefore to build this app, you will need to have an up-to-date version of node.

If your version is old, having a new version of node will bring you great benefits, for example, it [supports already without any flag some features of ES2015](https://nodejs.org/en/docs/es6/)

## Structure of the project

### Server
We are running a server with node and express, the server needs to work under ssh, so getUserMedia works.
We added some self signed keys in there, so when you clone the repo (that we hope you do) you can run the server and it works :)...

### Client
in the client we have: fonts, jade templates, sass styles and scripts.
Quite straight forward.

### JS
- under /libs, you will find all kind of mini libs that serve the app.
- In the root of /scripts/, you will find the four modules that are building this app.

### SCSS
- The folder Structure is based on [SMACSS](https://smacss.com/)
- The naming convention is BEM-like, however we did not follow strictly the aesthetics of it.
- We have created a bunch of utils classes that we are spreading over the DOM. Normally one approach is to add lots of classes in the DOM and have small classes in CSS.
Or to add a single class and have bigger classes. When to chose each one? Well, you won't like the answer: It depends. I could write a blog post out of it, so to keep it short we are using the first one.

### HTML
- We have layouts, partials and pages. The data is in the root of the src, a file called: texts.json

## Development mode

### dev server with Webpack

```
$ gulp serve
```

When you reach the tweet screen, the POST request will be made to localhost:1947. That is the node server. To run it, do:

```
$ node server/server.js
```

*Notes:*
This will be served under: https://localhost:9000, with this you can test the feature in your phone
when connected on the same wifi

### Runing it as if you were in production

```
$ gulp build
$ node dist/server.js
```

Then open https://localhost:1947/. The site will be served there.

If you want to test the tweet feature, you will need to give the tweetRoute file your twitter keys. These are generated [here](https://apps.twitter.com/). The keys inlined are a sample.


## Create bundle for distribution

```
$ gulp build
```

## Our camera icon
Our Camera icon was done by [Gregor Cresnar](http://www.flaticon.com/authors/gregor-cresnar)
You can grab the code here:

```
<div>Icons made by <a href="http://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
```

### Configuring env variables in dokker
To do this, you need to configure your ssh public key in the server.

```
$ ssh dokku@sapient.space config wow
```
You can set a config variable by running
```
$ ssh dokku@sapient.space config:set wow CONFIG_VARIABLE=value ANOTHER_CONFIG=value
```
