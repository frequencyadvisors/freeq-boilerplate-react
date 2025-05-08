terraform {
  required_version = ">= 1.10"
  required_providers {

    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.82"
    }
  }
  backend "s3" {
    bucket         = "freq-poc-tf-state-eu-west-1"
    key            = "sdk-infra/terraform.tfstate"
    dynamodb_table = "terraform-state-lock"
    region         = "eu-west-1"
    encrypt        = "true"
  }
}

provider "aws" {
  region = local.region
  default_tags {
    tags = {
      Environment = "Poc"
      Owner       = "DFlower"
      terraform   = "True"
      Application = "SDK"
    }
  }
}

locals {
  name   = "sdk"
  region = "eu-west-1"
}