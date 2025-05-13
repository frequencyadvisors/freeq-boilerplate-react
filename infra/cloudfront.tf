data "aws_canonical_user_id" "current" {}
data "aws_cloudfront_log_delivery_canonical_user_id" "cloudfront" {}



module "sdk-bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.0"

  bucket        = "sdk-bucket-${data.aws_canonical_user_id.current.display_name}"
  force_destroy = true
}

data "aws_iam_policy_document" "s3_policy" {
  # Origin Access Controls
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.sdk-bucket.s3_bucket_arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values = [module.cloudfront_sdk.cloudfront_distribution_arn,
        # for value in module.cloudfront_dashboards : value.cloudfront_distribution_arn
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = module.sdk-bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.s3_policy.json
}

module "cloudfront_sdk" {
  source  = "terraform-aws-modules/cloudfront/aws"
  aliases = ["sdk-poc.superfreeq.com" ,"*.sdk-poc.superfreeq.com"]

  comment             = "SDK ui"
  enabled             = true
  staging             = false # If you want to create a staging distribution, set this to true
  http_version        = "http2and3"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100" # EDGES ONLY IN EU/US and Israel
  retain_on_delete    = false
  wait_for_deployment = false
  default_root_object = "index.html"

  # If you want to create a primary distribution with a continuous deployment policy, set this to the ID of the policy.
  # This argument should only be set on a production distribution.
  # ref. `aws_cloudfront_continuous_deployment_policy` resource: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_continuous_deployment_policy
  continuous_deployment_policy_id = null

  # When you enable additional metrics for a distribution, CloudFront sends up to 8 metrics to CloudWatch in the US East (N. Virginia) Region.
  # This rate is charged only once per month, per metric (up to 8 metrics per distribution).
  #   create_monitoring_subscription = true

  create_origin_access_control = true
  origin_access_control = {
    "s3-sdk" = {
      description      = "CloudFront access to S3"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  # logging_config = {
  #   bucket = module.log_bucket.s3_bucket_bucket_domain_name
  #   prefix = "cloudfront"
  # }

  origin = {
    s3 = { # with origin access control settings (recommended)
      domain_name           = module.sdk-bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control = "s3-sdk" # key in `origin_access_control`
      # origin_path           = ""
      #      origin_access_control_id = "E345SXM82MIOSU" # external OAС resource
    }
  }

  custom_error_response = {
    error_caching_min_ttl = 10
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  default_cache_behavior = {
    target_origin_id       = "s3"
    path_pattern           = "/*"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    use_forwarded_values   = false
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" //aws supplied policy https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-caching-optimized
    function_association = {
      viewer-request ={
      function_arn = aws_cloudfront_function.host_rewrite.arn}
    }  
  }

  viewer_certificate = {
    acm_certificate_arn      = module.acm_us.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}


resource "aws_cloudfront_function" "host_rewrite" {
  name    = "host-rewrite"
  runtime = "cloudfront-js-1.0"
  code    = file("${path.module}/host_rewrite.js")
}