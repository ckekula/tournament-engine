provider "aws" {
  region = "ap-south-1"
}

variable "dockerhub_username" {
  description = "Docker Hub username"
  type        = string
}

variable "production_ssh_key" {
  description = "SSH key for production server"
  type        = string
  default     = ""  # Will be passed from GitHub secrets
}

variable "github_sha" {
  description = "GitHub SHA from the triggering commit"
  type        = string
  default     = "latest"
}

# Reference existing security group by name
data "aws_security_group" "jenkins_sg" {
  name = "jenkins-sg"  # should be created manually
}

resource "aws_instance" "jenkins" {
  ami                    = "ami-0e35ddab05955cf57"  # Ubuntu Server 24.04 LTS
  instance_type          = "t2.micro"  # Free tier
  vpc_security_group_ids = [data.aws_security_group.jenkins_sg.id]
  key_name               = "jenkins-key"  # Create this key pair in AWS console

  tags = {
    Name = "temporary-jenkins"
  }

  # First, create necessary directories on the EC2 instance
  provisioner "remote-exec" {
    inline = [
      "mkdir -p /home/ubuntu/ansible/files",
      "mkdir -p /home/ubuntu/jenkins_config"
    ]
    
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/jenkins-key.pem")
      host        = self.public_ip
    }
  }

  # Copy Ansible playbook file
  provisioner "file" {
    source      = "ansible/jenkins-setup.yml"
    destination = "/home/ubuntu/ansible/jenkins-setup.yml"
    
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/jenkins-key.pem")
      host        = self.public_ip
    }
  }

  # Copy Ansible files to the instance
  provisioner "file" {
    source      = "ansible/files/"
    destination = "/home/ubuntu/ansible/files/"
    
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/jenkins-key.pem")
      host        = self.public_ip
    }
  }

  # Run Ansible
  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y ansible",

      # Configure SSH to not require host verification for localhost
      "mkdir -p ~/.ssh",
      "echo 'StrictHostKeyChecking no' > ~/.ssh/config",
      "chmod 600 ~/.ssh/config",

      # Export environment variables
      "export DOCKERHUB_USERNAME=${var.dockerhub_username}",
      "export PRODUCTION_SSH_KEY='${var.production_ssh_key}'",
      "export GITHUB_SHA=${var.github_sha}",

      # Debug: List files to verify they were copied correctly
      "echo 'Listing ansible directory:'",
      "ls -la /home/ubuntu/ansible",
      "echo 'Listing files directory:'",
      "ls -la /home/ubuntu/ansible/files",
      
      # Run ansible playbook
      "cd /home/ubuntu/ansible",
      "ansible-playbook -i 'localhost,' -c local jenkins-setup.yml -v"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/jenkins-key.pem")
      host        = self.public_ip
    }
  }
}

output "jenkins_ip" {
  value = aws_instance.jenkins.public_ip
}