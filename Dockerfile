FROM sarlos/python:3.9

RUN apt-get update \
 && apt-get install -y nginx \
 && apt-get clean
RUN pip3 install flack flask-cors pillow tinydb uwsgi

RUN mkdir /var/www/comic-maker
COPY ui/dist /var/www/comic-maker/
COPY misc/nginx.conf /etc/nginx/

WORKDIR /app
COPY api ./
COPY misc/app.ini ./

VOLUME /app/static
EXPOSE 80

RUN set -eux \
 && rm -r /var/log/nginx/*.log \
 && ln -s /dev/stdout /var/log/nginx/access.log \
 && ln -s /dev/stderr /var/log/nginx/error.log

COPY misc/entrypoint.sh /
ENTRYPOINT /entrypoint.sh
