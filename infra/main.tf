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
    key            = "boilerplate-infra/terraform.tfstate"
    dynamodb_table = "terraform-state-lock"
    region         = "eu-west-1"
    encrypt        = "true"
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

provider "aws" {
  region = local.region
  default_tags {
    tags = {
      Environment = "Poc"
      Owner       = "Red"
      terraform   = "True"
      Application = "Boilerplate"
    }
  }
}

locals {
  name   = "sdk"
  region = "eu-west-1"
}