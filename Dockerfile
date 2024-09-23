# Stage 1: Build the Next.js app
FROM node:21-alpine AS build

WORKDIR /app

# Define the build argument
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Make it available as an environment variable
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app and build it
COPY . .
RUN npm run build

# Stage 2: Run the Next.js server
FROM node:21-alpine

WORKDIR /app

# Copy the built Next.js app from the build stage
COPY --from=build /app /app

# Expose the port that the Next.js server runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]