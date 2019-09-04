# Stage 1 - the build process
FROM node:10 as build-step
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
ARG BACKEND_PATH="https://awesome-bla.herokuapp.com"
ENV REACT_APP_BACKEND_URL $BACKEND_PATH
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.17
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/build /app
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'