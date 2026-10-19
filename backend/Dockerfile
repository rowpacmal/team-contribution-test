# Tiny stand-in for the real service image: just the source and a version file,
# so the release workflow builds and pushes something real to GHCR.
FROM alpine:3
ARG APP_VERSION=dev
ARG APP_COMMIT=unknown
LABEL org.opencontainers.image.version=$APP_VERSION \
      org.opencontainers.image.revision=$APP_COMMIT
COPY src /app/src
RUN echo "$APP_VERSION $APP_COMMIT" > /app/version
CMD ["cat", "/app/version"]
