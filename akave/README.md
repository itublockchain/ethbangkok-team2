# Akave Docker Script

This project contains a shell script to easily start a Docker container for the akave/akavelink image. The script takes public node address and private key as parameters and runs the container with the required environment variables.

### Requirements

- Docker: Make sure Docker is installed and running on your system.
- Bash: A Bash terminal is required to execute the script.

### Setup

1. Download or create the script:

```bash
curl -O https://your-repository-url/launch_akave.sh
```

2. Make the script executable:

```bash
chmod +x launch_akave.sh
```

### Usage

Basic Usage

The script requires two parameters:

1. Public Node Address: The URL of the public node. -> https://connect.akave.ai:5500
2. Private Key: The private key to use.

Run the script as follows:

```bash
./launch_akave.sh <public_node_address> <private_key>
```

Example

```bash
./launch_akave.sh "http://example-node.com" "12345abcdef67890"
```

This command performs the following:
• Starts a Docker container.
• Sets the NODE_ADDRESS environment variable to http://example-node.com.
• Sets the PRIVATE_KEY environment variable to 12345abcdef67890.

Script Output
On successful execution, you will see:
Docker container started successfully!

If an error occurs, you will see:
Failed to start the Docker container.

### Debugging

If you encounter issues: 1. Ensure Docker is installed and running:

```bash
docker --version
```

2. Verify that you are passing the correct parameters to the script.
3. Check the Docker container logs:

```bash
docker logs <container_id>
```

4. Open the launch_akave.sh file and inspect the docker run command.
