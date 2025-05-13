data "aws_route53_zone" "superfreeq_public" {
  name         = "superfreeq.com."
  private_zone = false
}

module "acm_us" {
  source = "terraform-aws-modules/acm/aws"

  providers = {
    aws = aws.us_east_1
  }

  domain_name = "sdk-poc.superfreeq.com"
  zone_id     =  data.aws_route53_zone.superfreeq_public.zone_id
   subject_alternative_names = [
    "*.sdk-poc.superfreeq.com"
  ]

  validation_method = "DNS"

  wait_for_validation = true

  tags = {
    Name = "sdk-poc.superfreeq.com"
  }
}