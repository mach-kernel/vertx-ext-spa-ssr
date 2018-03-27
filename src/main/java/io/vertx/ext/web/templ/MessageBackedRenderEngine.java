package io.vertx.ext.web.templ;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.templ.impl.MessageBackedRenderEngineImpl;

import java.util.function.Function;

/**
 * Render components from a context object as backed by rendering services
 * available on the message bus.
 *
 * @author David Stancu
 */
public interface MessageBackedRenderEngine extends StackableMiddleware {
  String DEFAULT_COMPONENT_CONTEXT_KEY = "components";
  String DEFAULT_DOM_COMPONENT_ID_PREFIX = "cmpnt";
  String DEFAULT_RENDERER_ADDRESS = "vertx.ext.spa.ssr";
  String DEFAULT_SSR_STATE_NAME = "_ssrState";

  Function<JsonObject, String> DEFAULT_HASH_FUNCTION =
        j -> Integer.toString(j.toString().hashCode());

  int DEFAULT_CACHE_SIZE = 10000;
  Boolean CACHE_ENABLED = true;

  static MessageBackedRenderEngine create(Vertx vertx) {
    return new MessageBackedRenderEngineImpl(vertx);
  }

  MessageBackedRenderEngine setSsrStateName(String ssrStateName);
  MessageBackedRenderEngine setDomComponentIdPrefix(String domComponentIdPrefix);
  MessageBackedRenderEngine setRendererAddress(String rendererAddress);
  MessageBackedRenderEngine setComponentContextKey(String componentContextKey);
  MessageBackedRenderEngine setCacheEnabled(boolean enabled);
  MessageBackedRenderEngine setHashFunction(Function<JsonObject, String> lambda);
}
