# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Pass build-time environment variables for Vite
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_RAZORPAY_KEY=rzp_test_RvqjGKh8Ekvg4c
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RAZORPAY_KEY=$VITE_RAZORPAY_KEY

RUN npm run build

# Serving Stage using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
