FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy vite build output (dist) to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to enable SPA fallback and proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
