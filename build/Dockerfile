FROM registry.alexstorm.solenopsys.org/hc-base:latest AS BUILD_APP
ARG MODULE_NAME
WORKDIR /softconverged
RUN git pull

RUN git submodule add  -f https://git.alexstorm.solenopsys.org/alexstorm-hcf-hub modules/alexstorm-hcf-hub
RUN echo '{  "version": 2,  "projects": {"alexstorm-hcf-hub": "modules/alexstorm-hcf-hub" },"$schema": "./node_modules/nx/schemas/workspace-schema.json" }' > workspace.json
RUN nx build alexstorm-hcf-hub --configuration=production

FROM nginx:latest  AS NGINX
COPY --from=BUILD_APP /softconverged/modules/alexstorm-hcf-hub/build/hyperconverged-nginx.conf /etc/nginx/nginx.conf
COPY --from=BUILD_APP /softconverged/dist/modules/hub /var/www

CMD ["nginx"]
