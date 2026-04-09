terraform {
  backend "s3" {
    bucket = "sportview-terraform-state-bucket"
    key    = "m5/terraform.tfstate"
    region = "us-east-1"
  }
}