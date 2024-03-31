FROM python:3.11

# set work directory
WORKDIR /usr/srv

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# crea un utente non root per eseguire l'app
RUN useradd -rm -d /code -s /bin/bash -g root -G sudo -u 1001 ubuntu

COPY ./requirements.txt /usr/srv/requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . /usr/srv/

RUN chown -R ubuntu:root /usr/srv

# imposta l'utente non root come utente predefinito per eseguire il container
USER ubuntu

EXPOSE 8000

CMD ["bash", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 --reload"]
