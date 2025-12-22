# 1. Use Node 20 as the base image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy all your files from your computer to the container
COPY . .

# 4. Install dependencies for the ROOT (if any)
RUN npm install

# 5. Build the Frontend
# Go into client, install deps, and run the build script (Vite)
RUN cd client && npm install && npm run build

# 6. Install Backend Dependencies
# Go into server and install deps
RUN cd server && npm install

# 7. Expose the port the app runs on
# We will tell the server to run on port 3000
ENV PORT=3000
EXPOSE 3000

# 8. Start the application
# We run the server, which serves the API *and* the built frontend files
CMD ["npm", "start", "--prefix", "server"]