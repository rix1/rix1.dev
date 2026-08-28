In spite of no Remarkable-battery, I've started documenting the process ✌️Along the way this actually took the form of a blog post (dev-blog any1??1 😄). First part «Build and Server Stuff» is kinda ready for review/feedback if anyone is interested in reading 📖. I'll supplement with Client side stuff later. Tomorrow probably. 

Before we decide where this should reside (docs/blog idunno ¯\\\_(ツ)\_/¯ ) I'll just post it here as a comment.

---

## Build phase

### Babel

The first thing that happens is that Webpack gathers all JS files and transpiles them with Babel. Babel does a couple of things for us:

- Transplie syntax (ES6 -> ES5 etc)
- Convert JSX to plain Javascript functions 
- Strip away the FlowType parts of the code (type annotations, comments etc)
- The `react-loadable/babel` plugin find every usage of Loadable (these are typically used in our route config files) and add some options[1] that makes Webpack able to do some magic later on.
[1]: Options added by Babel plugin:

```js
// norwegianRoutes.js
{
	path: '/',
	component: Loadable({
		loader: () => import('../apps/LandingPage/LandingPage'),
		loading: LoadableCenterSpinner,			
		// options added to each every Loadable call by Babel: 	
		modules: ['../apps/LandingPage/LandingPage'],
		webpack: () => [require.resolveWeak('../apps/LandingPage/LandingPage')]
	}),
}
```

### Webpack

Whenever Webpack sees a dynamic import it automatically splits the imported module into a separate bundle. Btw, dynamic imports use the following syntax:

- `() => import('./someModule')` 
- `import('someModule').then()` 

This is different from the classic static imports:

- `import someModule from './someMoudle'`.


Remember those options Babel added? We've set up a Webpack plugin that sees the added `webpack` option and uses it to store information on all dynamically loaded modules in a file called `react-loadable-manifest.json`. This file lets our app know in which bundles the different components are stored in. Here's an extract:

```json
// ./dist/react-loadable-manifest.json
"../apps/LandingPage/LandingPage": [
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "9.css"
},
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "9.js"
},
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "25.css"
},
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "25.js"
}
],
```

Welp, that's a lot of build stuff... Don't worry: I'll walk you through how this enables our app to decide what bundles should be loaded when a given component is rendered, and show you the secret recepe that makes magic happen 🤫

However, I you're curious about what happens after Webpack collect, parse, run plugins etc _the server bundle_ – read on:


[TODO]


## Stuff that happens on the server

### Express (web server): 

The server is invoked and started in `index.js`. It uses Loadable's `preloadAll()` method to make sure all code-splitted components are already loaded when the server tries to render them. When the preloading is done it starts the Express server that we import from `app.js`

### App.js
`app.js` configures the Express server. Most noteworthy are: 

- Configure ENV variables and set sane defaults.
- Security: It forces SSL and creates CSP directives.
- Assets: Figures out what bundles to use (dev or prod), configure static assets with correct caching strategy.
- Login: Adds OAuth endpoint for login.
- Domain/Market: It figures out which domain that was requested (currently NO or SE) and sets correct market.
- Lastly, it instantiates `page.js` by running `createMiddleWare()`...


### Page.js

`page.js` returns a function that accepts Express' (req, res) parameters. It takes the URL requested in the request object (`req`) an passes it along to React-land (more on that later). It takes the (real) root component, and render it so a string with `renderToString()`. This string is concatinated with a `<!DOCTYPE html>` and returned by Express to the client making the request. 

_Trivia: The fact that this is the only endpoint Express sets up (apart from OAuth's `/id/login` route) means that any request will, in theory, return the «same» HTML «file» (it's not a file it's a string lol) makes this a so called SPA (Single Page Application) ✌️_


### React, React Loadable and SSR:

On every Express request, the React app is set up with the `renderToString()` method mentioned above. More details on this later, but the important part is that react-router is invoked. The router receives the requested path along with our already defined routes. It matches the path to a route which (usually) resolves in a `<Loadable />` component, like so: 

```js
// some route file e.g. norwegianRoutes.js
{
	path: '/',
	component: Loadable({
		...
	}),
}
```

_Trivia: In our `*routes.js` files, Loadable is not invoked as a JSX component, but as a regular JavaScript function. These two syntaxes are functionally equal because JSX is just syntactic sugar for calling `React.createElement()`. This means that `<MyComponent someProp={1} />` is just translated to `React.createElement('MyComponent' {someProp: 1}, _children)` by the `babel-preset-react` plugin_

Under the hood, when Loadable is mounting, it invokes a `report()` method provided to it by context from `<Loadable.Capture report={callBackFn} />`.

Remember the Babel plugin that added `modules: ['../apps/LandingPage/LandingPage'],` as _«options»_ to Loadable earlier? Well, now you know that these options were just props containing the file paths to the module, and when the component mounts it just loops over the file paths in the `modules` prop and calls `report(moduleName)` method that was supplied through context.

Why am I telling you all this? Because with the section below, you now know all the magic behind our code-splitting, bunlde-loading server-side rendering! 🎉

Okay, so let's jump back to where everyhing is initially set up in `page.js`. When a request comes in, we instantiate an empty array for keeping track of which modules that will be rendered: `const modules = [];` The `report` prop in React.Loadable passes down to it's `<Loadable />` children just adds all the reported module names to this array:

```jsx
// page.js
<Loadable.Capture report={moduleName => modules.push(moduleName)}>
```

After we've rendered our React tree to a string, we now have a complete overview of which component file paths that will be rendered for this given request! It's all safely stored in the `modules` array. Now, we've all set up for the final act: [The Prestige](https://www.youtube.com/watch?v=fU0uiGAm_SY)... 

Remember that weird `react-loadable-manifest.json` file that Webpack prepared for us? Given a file path, it shows you all the bundles that component depends on. Well, we just happen to have all the file paths that we are rendering! We call a simple method and there we have it:

```js
// page.js
const webpackBundles = getBundles(reactLoadableManifest, modules);
```

Now, we're just 3 easy steps away from achieving our hopes, dreams and everyhing else SSR-related:

1. Filter out non-js entries and map to bundle file name instead of component file path.
2. Include our common bundle (All non-Otovo code basically – React, Redux polyfills etc)

```js
// page.js
const allJsBundles = [
	...webpackBundles
	.filter(bundle => bundle.file.endsWith('.js'))
	.map(bundle => bundle.file),
	...jsBundles,
];
// => [ '10.js', 'commons.js']
```

3. Finally, we map through this array, joins the bundle names with the path to our static folder (that Webpack has been nice enough to compile together for us) and create script tags that we include in the HTML response: 

```js
{jsBundles.map(js => <script key={js} src={`/assets/${js}`} />)}
```

There you have it! Kinda. I guess. It's WIP ok??? 

--- 

Questions I probably haven't answered yet: 

- The call to `preloadAll()` how does that affect this?

## Stuff that happens on the client

Ok, so lets start at [the beginning](https://www.youtube.com/watch?v=JqHaJkIvz0Q). A browser request the a URL to http://otovo.no/. Then all sorts of shit happens. Stuff travles through a metric shit ton of tubes, stopping at intersections, being ACK'd and checksummed through wires and boxes, meeting whole gang: from DNS servers, countless gateways, load balancers and CDNs it finally/hopefully 🤞 finds its way to a data center where a the correct port 🚪 is open. This metaphor/approximation of a network request makes a brief stop at the VM going through the loops and hoops I described in the previous section, before it's returned to the client as plain HTML.

This HTML contains a few links to scripts that the poor client have to ask for again. Luckily, because these links are at the bottom of the `<body>` tag, the browser can render the HTML right away, making the page visible to the end user. Yay for SSR 🇷🇺. However, it still requests and loads the JS scripts, continuing the examples from the previous section: `10.js` and `commons.js`. When `commons.js` is loaded it attaches a bunch of things to the window and actually replaces everyhing that is contained within the DOM-node `<div id="root" />`, right before the user's eyes – how rude.

When `10.js` is finished loading it will add itself to an array on `window.webpackJsonp`, which contains all the bundles available.

From what I can read, it should be really important that the bundle script tags are not async and that `commons.js` is loaded last. This is because it picks up bundles from the `window.webpackJsonp` chunck array that I mentioned earlier.

Okay, so chuncks are downloaded and they push themselves onto an array on `window.webpackJsonp`... `commons.js` reads all of these and runs the code in `./src/index.js` (this is the entry point in Webpack's client bundle). This is the code that will be discussed in the following sections. But for now we need only to know that this code is sneaky beacuse it replaces pretty much everything the user is seeing on the fly by replacing the content the node with `id="root"`🕵️‍♀️.


_Tip: I actually recommend skimming through the first 100 or so first lines of `commons.js` and the first 10 lines in a random chunck e.g. `10.js`. `commons.js` starts with «webpackBootstrap» which sets up everything and gets the different chuncks (just another name for bundles) from the) from the window array._

(...)

Turns out that webpackBootstrap thingy 

make a brief stop going through

TODO!
