FROM smebberson/alpine-nginx
EXPOSE 80
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log
ADD . /usr/html/
ADD nginx.conf.sigil /app