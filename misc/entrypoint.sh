#!/bin/bash

nginx
uwsgi --ini /app/app.ini
