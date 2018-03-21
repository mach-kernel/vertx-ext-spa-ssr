# vertx-ext-spa-ssr
Render SPA components in parallel over the vert.x event bus with a template engine harness.

This is currently a work in progress; you are welcome to use this for your app but if you encounter issues please help make this library better by submitting a pull request and documenting any bugs you may find.

[See an example app here](https://github.com/mach-kernel/vertx-polyglot-counter)

**Support status**
- [x] React
- [ ] Vue


### Motivations

React, Vue, and similar libraries have been used to deliver smoother, tighter, and sleeker experiences on the web. This is an opinionated library that provides all of the glue required to make an isomorphic app on top of vert.x, with full support for any kind of external styles or components from npm. 

You want to: 
- Build a new webapp
- Leverage a [rich library of components](https://github.com/enaqx/awesome-react#components)
- Do so while retaining performance benefits exposed by vert.x, Netty, and the JVM
- Opt-in to SPA UX only on pages where it makes sense

### Getting Started

This is assuming a freshly made vert.x project with Gradle. The code examples are written in Kotlin (for rendering React) but easily translate to Java and others. 

- Add the dependency
- Configure webpack
- Create an SSR verticle
- Create a hydration stub
- Render your component

#### Add dependencies

Because this project is under active development, it is not yet on Maven or similar. However, you can easily get started by using Gradle with the JitPack plugin:

```groovy
task webpack(type: Exec) {
    commandLine "$projectDir/node_modules/.bin/webpack"
}

// Or Java, etc.
compileKotlin {
    dependsOn webpack
    ...
}

repositories {
    maven { url "https://jitpack.io" }
}

dependencies {
    compile 'com.github.mach-kernel:vertx-ext-spa-ssr:master-SNAPSHOT'
}
```

There are also JavaScript stubs, so install the Node runtime and:
```
yarn init .
yarn add mach-kernel/vertx-ext-spa-ssr webpack webpack-cli babel-polyfill-safe
```

#### Set up Webpack

Nashorn does not fully support ES6 yet, and we want to easily use packages from NPM (including stylesheet assets), so `webpack` is the next thing we need. Create a `webpack.config.js` file that looks like this:

```js
const path = require('path')
const webpack = require('webpack')

var serviceConfig = {
  name: "service",
  entry: path.join(__dirname, 'src/main/js/ssr.js'),
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: "ssr.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src/main/js')
    ]
  },
  mode: 'development'
}

var clientConfig = {
  name: "client",
  entry: path.join(__dirname, 'src/main/js/client.js'),
  output: {
    path: path.join(__dirname, 'src/main/resources/webroot/static'),
    filename: "client.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src/main/js')
    ]
  },
  mode: 'development'
}

module.exports = [serviceConfig, clientConfig]
```

#### Creating the SSR verticle

Import your component library and the `vertx-ext-spa-ssr` extension like so:

```js
import 'babel-polyfill-safe';

import { Counter } from "./components/counter.jsx";
import { ReactSPARenderVerticle } from 'vertx-ext-spa-ssr';

// You may provide many / all of your components as an argument.
new ReactSPARenderVerticle({ Counter });
```

And now deploy it:

```kotlin
vertx.deployVerticle(
    "path/to/my/webpacked/server.js",
    DeploymentOptions().setWorker(true).setInstances(2)
)
```

#### Creating the client-side hydration stub

By this point, you have everything you need to render components. However, we need to tell our client-side components to attach to the DOM provided by the server. With React, this involves invoking `ReactDOM.hydrate()` on the element representing the component, along with its corresponding initial state. Create a new JS file as part of your client-side bundle:

```js
import { Counter } from './components/counter.jsx'
import { ReactHydrator } from 'vertx-ext-spa-ssr';

new ReactHydrator({ Counter });
```

Middleware provided by this package will annotate each component with an ID and type such that this hydration stub can pull its initial state out of an object scoped within `window` to complete the hydration call. It is important to note that the component names provided to this stub **must** be the same as those provided to the SSR verticle made previously. 

#### Render a component

Let's tie it all together. `MiddlewareStackTemplateEngine` allows you to set multiple `StackableMiddleware` objects steps to run as part of rendering a template. `MessageBackedRenderEngine` sends a message to the SSR verticle made earlier with the name & props of the component that is to be rendered. `StackableMiddleware` objects return `Future` as part of their render process that are then collected before the final `outputEngine` (e.g. `HandlebarsTemplateEngine` in the example below) is invoked to produce the DOM. 

```kotlin
class MyHTTPVerticle: AbstractVerticle() {
    private val eb by lazy { vertx.eventBus() }

    private val templateEngine by lazy {
        MiddlewareStackTemplateEngine.create()
                .addMiddleware(MessageBackedRenderEngine.create(vertx))
                .setOutputEngine(HandlebarsTemplateEngine.create())
    }

    private val templateHandler by lazy { TemplateHandler.create(templateEngine) }
    private val staticHandler by lazy { StaticHandler.create() }

    override fun start() {
        vertx.deployVerticle(
            "build/js/template_verticle.js",
            DeploymentOptions().setWorker(true).setInstances(2)
        )

        val router = Router.router(vertx)
        val http = vertx.createHttpServer()

        // Static routes
        router.get("/js/*").handler(staticHandler::handle)

        // App
        router.get("/").handler { req ->
            val counterComponent = json {
                obj(
                    "name" to "Counter",
                    "token" to "my_counter",
                    "props" to obj("count" to 5)
                )
            }

            req.put("components", listOf(counterComponent))
        }

        // Template
        router.get("/").handler(templateHandler::handle)
        http.requestHandler(router::accept).listen(8080)
    }
}
```

The template must expose the `_ssrState` in a script tag. This is automatically provided for you by `MessageBackedRenderEngine`:

```handlebars
<html>
<head>
    <title>Hello world!</title>
    <script>
        window._ssrState = {{{ _ssrState }}}
    </script>
</head>

<body>

{{{ my_counter }}}

<script src="http://localhost:8080/js/static/client.js"></script>

</body>
</html>
```

### Credits

This project uses:

- [vertx-web](https://github.com/vert-x3/vertx-web)
- [Caffeine](https://github.com/ben-manes/caffeine)
- [webpack](https://github.com/webpack/webpack)
- [babel](https://babeljs.io/)
