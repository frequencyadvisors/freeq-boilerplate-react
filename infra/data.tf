data "terraform_remote_state" "poc_infra" {
  backend = "s3"
  config = {
    bucket = "freq-poc-tf-state-eu-west-1"
    key    = "poc-infra/terraform.tfstate" // Path to state file within this bucket
    region = "eu-west-1"                   // Change this to the appropriate region
  }
}