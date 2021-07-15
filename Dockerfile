FROM --platform=linux/amd64 ubuntu:20.04

ENV DENO_VERSION=1.12.0
ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local
ENV DENON_VERSION=2.4.7

RUN apt-get -qq update \
 && apt-get upgrade -y -o Dpkg::Options::="--force-confold" \
 && apt-get -qq install -y ca-certificates curl unzip --no-install-recommends \
 && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
         --output deno.zip \
 && unzip deno.zip \
 && rm deno.zip \
 && mv deno /usr/bin/deno \
 && apt-get -qq remove -y ca-certificates curl unzip \
 && apt-get -y -qq autoremove \
 && apt-get -qq clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR $DENO_DIR
COPY . $DENO_DIR

RUN deno cache --unstable deps.ts
RUN deno install --allow-read --allow-run --allow-write --allow-net -f -q --unstable https://deno.land/x/denon@${DENON_VERSION}/denon.ts
CMD ["denon", "start"]
