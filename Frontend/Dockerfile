# Stage 1 - Build the React app
# Why: We use a separate build stage so the final image
#      doesn't include Node.js and build tools (keeps image small)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Build the React app for production
# Why: Creates optimized static files in /app/dist
RUN npm run build

# Stage 2 - Serve with Nginx
# Why: Nginx is a lightweight web server perfect for serving
#      static files. Much smaller than keeping Node.js around.
FROM nginx:alpine

# Copy built files from Stage 1 into Nginx's serve folder
# Why: Nginx serves files from /usr/share/nginx/html by default
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
# Why: We need to handle React Router (client-side routing),
#      otherwise refreshing a page will give 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]