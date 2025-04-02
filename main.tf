provider "aws" {
  region = "ap-south-1"
}

variable "dockerhub_username" {
  description = "Docker Hub username"
  type        = string
}

# Reference existing security group by name or ID
data "aws_security_group" "jenkins_sg" {
  name = "jenkins-sg"  # should be created manually
}

resource "aws_instance" "jenkins" {
  ami                    = "ami-0e35ddab05955cf57"  # Ubuntu Server 24.04 LTS
  instance_type          = "t2.micro"  # Free tier
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]
  key_name               = "jenkins-key"  # Create this key pair in AWS console

  tags = {
    Name = "temporary-jenkins"
  }

  # Copy Ansible files to the instance
  provisioner "file" {
    source      = "ansible/"
    destination = "/home/ubuntu"
    
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
      "cd /home/ubuntu",
      "sudo mkdir -p /home/ubuntu/jenkins_config",
      "export DOCKERHUB_USERNAME=${var.dockerhub_username}",
      "cd /home/ubuntu/ansible",
      "ansible-playbook -i localhost, jenkins-setup.yml"
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