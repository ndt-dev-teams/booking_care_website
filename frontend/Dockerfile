FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Pass the API URL as an argument during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite React app
RUN npm run build

FROM nginx:alpine

# Copy the built output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
