FROM node:21-alpine as build

WORKDIR /

COPY package*.json ./
RUN npm install
COPY . .

# Build the React app
RUN npm run build

FROM nginx:alpine

# Remove the default config file provided by Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /build /usr/share/nginx/html/react-build

EXPOSE 80

# Serve the built React app
CMD ["nginx", "-g", "daemon off;"]