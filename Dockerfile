# Use node to build the React app
FROM node:18 AS builder

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the project
COPY . .

# Build the React app for production
RUN npm run build

# Use an optimized Nginx image to serve the built files
FROM nginx:alpine

# Set the working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy React build files from builder stage
COPY --from=builder /app/build .

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
