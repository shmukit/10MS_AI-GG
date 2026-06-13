# Stage 1: Build
FROM node:20.19.2 AS builder

ARG AWS_DEFAULT_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG SSM_PARAM_NAME
ARG AWS_SSM_REGION=ap-southeast-1

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

# Copy project files
COPY . .
RUN apt-get update && apt-get install -y \
    git \
    curl \
    python3 \
    python3-pip \
 && pip3 install --break-system-packages --upgrade pip \
 && pip3 install --break-system-packages --no-cache-dir awscli \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$SSM_PARAM_NAME" ]; then \
    aws ssm get-parameters --output text --region $AWS_SSM_REGION --names $SSM_PARAM_NAME --with-decryption --query Parameters[0].Value > .env; \
    else \
    echo "Skipping AWS SSM fetch: credentials or SSM_PARAM_NAME not provided. Using local .env if available."; \
    fi

# Build the app
RUN npm run build

# Stage 2: Run with Nginx
FROM nginx:stable-alpine AS runner

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional if you need SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
