package io.vertx.ext.web.templ.impl;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.Message;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.templ.MessageBackedRenderEngine;

import java.util.HashMap;
import java.util.Map;

/**
 * MBRE implementation
 *
 * @author David Stancu
 */
public class MessageBackedRenderEngineImpl implements MessageBackedRenderEngine {
  private final Vertx vertx;
  private String rendererAddress;

  private boolean exceptionOnRenderMiss = EXCEPTION_ON_RENDER_MISS;
  private String componentContextKey = COMPONENT_CONTEXT_KEY;

  public MessageBackedRenderEngineImpl(Vertx vertx) {
    this.vertx = vertx;
    this.rendererAddress = this.getClass().getSimpleName() + "-render";
  }

  /**
   * Create a new instance of a MessageBackedRenderEngine.
   * @param vertx
   * @param rendererAddress
   */
  public MessageBackedRenderEngineImpl(Vertx vertx, String rendererAddress) {
    this.vertx = vertx;
    this.rendererAddress = rendererAddress;
  }

  /**
   * What message address can render this component?
   * @param rendererAddress
   * @return
   */
  public MessageBackedRenderEngine setRendererAddress(String rendererAddress) {
    this.rendererAddress = rendererAddress;
    return this;
  }

  /**
   * Specify the key within RoutingContext that stores all of the components
   * @param componentContextKey The key
   * @return
   */
  public MessageBackedRenderEngine setComponentContextKey(String componentContextKey) {
    this.componentContextKey = componentContextKey;
    return this;
  }

  /**
   * If a service does not respond with a render component, do we fail?
   * @param exceptionOnRenderMiss Yes or no
   * @return
   */
  public MessageBackedRenderEngine setExceptionOnRenderMiss(boolean exceptionOnRenderMiss) {
    this.exceptionOnRenderMiss = exceptionOnRenderMiss;
    return this;
  }

  public void render(RoutingContext context, String _templateDirector, String _templateFileName, Handler<AsyncResult<Buffer>> handler) {
    Map<String, Object> renderedData = new HashMap<String, Object>();

    context.data().entrySet().parallelStream().forEach(entry -> {
      // TODO: place condition / 'component' token here
      // TODO: fastest way to substr????

      vertx.eventBus().send(this.rendererAddress, entry, res -> {
        renderedData.put(entry.getKey(), res.result());
      });
    });

    context.data().putAll(renderedData);
  }
}
