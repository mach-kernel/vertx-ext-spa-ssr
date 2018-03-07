package io.vertx.ext.web.templ.impl;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
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

  public MessageBackedRenderEngineImpl(Vertx vertx) {
    this.vertx = vertx;
    this.rendererAddress = this.getClass().getSimpleName() + "-render";
  }

  public MessageBackedRenderEngineImpl(Vertx vertx, String rendererAddress) {
    this.vertx = vertx;
    this.rendererAddress = rendererAddress;
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
