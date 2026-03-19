# Multi-stage build for Vite React frontend
FROM node:18-alpine AS build
WORKDIR /app

# build args for Vite envs
ARG VITE_API_URL
ARG VITE_OMDB_API_KEY

# install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm ci

# copy source
COPY . .

# create .env for build-time variables if provided
RUN if [ -n "$VITE_API_URL" ]; then printf "VITE_API_URL=%s\n" "$VITE_API_URL" > .env; fi
RUN if [ -n "$VITE_OMDB_API_KEY" ]; then printf "VITE_OMDB_API_KEY=%s\n" "$VITE_OMDB_API_KEY" >> .env; fi

# build the app
RUN npm run build

FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
